import { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import TopNavbar from '../components/navigation/TopNavbar';
import BottomNavbar from '../components/navigation/BottomNavbar';
import GroupSelector, { MemoryFilter } from '../components/navigation/GroupSelector';
import AnswerOption, { AnswerState } from '../components/card/Answeroption';
import TextButton from '../components/ui/TextButton';
import { useKarutaGroupFilter } from '../hook/useKarutaGroupFilter';
import { useProgressStore } from '../store/useProgressStore';
import { karutaImages } from '../data/karutaImages';
import karutaData from '../data/karuta.json';
import { Karuta, KarutaData } from '../types/karuta';
import { shuffle } from '../utils/shuffle';

const ALL_CARDS = (karutaData as KarutaData).cards;
const NEXT_DELAY = 800; // ตอบถูกแล้วรอกี่ ms ก่อนไปใบถัดไป
const EASE_OUT = Easing.out(Easing.cubic);

/** คำตอบถูก 1 + ตัวหลอกสุ่ม 3 จากไพ่ทั้งหมด */
function buildOptions(card: Karuta) {
  const others = shuffle(ALL_CARDS.filter((c) => c.id !== card.id)).slice(0, 3);
  return shuffle([card, ...others]);
}

/** ไพ่ใบนี้ผ่านตัวกรอง "จำได้/จำไม่ได้" ไหม */
const matchesMemory = (filter: MemoryFilter, learned: boolean) =>
  filter === 'all' || (filter === 'learned') === learned;

export default function Learning() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.48, 240); // Figma: 193 บนจอ 402

  const { filtered, selectedGroup, setSelectedGroup, sortOrder, setSortOrder } =
    useKarutaGroupFilter(ALL_CARDS);
  const learnedIds = useProgressStore((s) => s.learnedIds);
  const markAsLearned = useProgressStore((s) => s.markAsLearned);

  const [memoryFilter, setMemoryFilter] = useState<MemoryFilter>('unlearned');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [pickedId, setPickedId] = useState<number | null>(null);

  // กรองตามการจำ (ค่าเริ่มต้น: ถามเฉพาะใบที่ยังจำไม่ได้) — ใบที่อยู่บนจอค้างไว้จนกว่าจะเลื่อนออก
  const queue = filtered.filter(
    (c) => c.id === currentId || matchesMemory(memoryFilter, learnedIds.includes(c.id))
  );
  const card = queue.find((c) => c.id === currentId) ?? queue[0];
  const options = useMemo(() => (card ? buildOptions(card) : []), [card]);

  // ---- animation เปลี่ยนไพ่: เลื่อนซ้าย/ขวาเป็นเส้นตรง ----
  const x = useSharedValue(0);

  /** dir 1 = ใบถัดไป, -1 = ใบก่อนหน้า (เรียกหลังใบเดิมเลื่อนพ้นจอแล้ว) */
  const change = (dir: number) => {
    if (!card) return;
    const next = queue[(queue.indexOf(card) + dir + queue.length) % queue.length];
    // เหลือใบเดียวและใบนั้นหลุดตัวกรองแล้ว (เช่น เพิ่งจำได้) → ชุดนี้หมดแล้ว
    const learnedNow = useProgressStore.getState().learnedIds.includes(card.id);
    const nothingLeft = next.id === card.id && !matchesMemory(memoryFilter, learnedNow);
    setCurrentId(nothingLeft ? null : next.id);
    setPickedId(null);
    x.value = dir * width;
    x.value = withTiming(0, { duration: 260, easing: EASE_OUT });
  };

  const slideTo = (dir: number) => {
    x.value = withTiming(-dir * width, { duration: 200 }, (finished) => {
      if (finished) scheduleOnRN(change, dir);
    });
  };

  // ปัดไพ่ซ้าย/ขวา (แนวนอนเท่านั้น ไม่กวนการเลื่อนจอขึ้นลง)
  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      x.value = e.translationX;
    })
    .onEnd((e) => {
      const fast = Math.abs(e.velocityX) > 600;
      if (!fast && Math.abs(e.translationX) < width * 0.25) {
        x.value = withSpring(0);
        return;
      }
      const dir = (fast ? e.velocityX : e.translationX) < 0 ? 1 : -1;
      x.value = withTiming(-dir * width, { duration: 200 }, (finished) => {
        if (finished) scheduleOnRN(change, dir);
      });
    });

  const cardStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(Math.abs(x.value) / width, 1) * 0.7,
    transform: [{ translateX: x.value }],
  }));

  // ตอบถูก → รอสักครู่แล้วเลื่อนไปใบถัดไปเอง
  const isCorrect = card !== undefined && pickedId === card.id;
  useEffect(() => {
    if (!isCorrect) return;
    const timer = setTimeout(() => slideTo(1), NEXT_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect]);

  const answer = (id: number) => {
    setCurrentId(card.id); // ล็อกใบนี้ไว้บนจอ แม้จะกลายเป็น "จำได้แล้ว"
    setPickedId(id);
    if (id === card.id) markAsLearned(card.id);
  };

  // เปลี่ยนกลุ่ม/ลำดับ/ตัวกรอง → เริ่มที่ใบแรกของชุดใหม่
  const resetPosition = () => {
    setCurrentId(null);
    setPickedId(null);
  };

  // หลังตอบ: ข้อถูกเป็นสีเขียวเสมอ, ข้อที่เลือกผิดเป็นสีแดง
  const stateOf = (id: number): AnswerState => {
    if (pickedId === null) return 'idle';
    if (id === card.id) return 'correct';
    return id === pickedId ? 'wrong' : 'idle';
  };

  return (
    <View className="flex-1 bg-[#F1F3E0]">
      <TopNavbar
        rightSlot={
          <GroupSelector
            selectedGroup={selectedGroup}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              resetPosition();
            }}
            sortOrder={sortOrder}
            onToggleSortOrder={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              resetPosition();
            }}
            memoryFilter={memoryFilter}
            onChangeMemoryFilter={(filter) => {
              setMemoryFilter(filter);
              resetPosition();
            }}
          />
        }
      />

      {!card ? (
        <View className="flex-1 items-center justify-center px-10 pb-32">
          <Text className="text-black text-2xl text-center">
            {memoryFilter === 'learned' ? 'ยังไม่มีไพ่ที่จำได้ในชุดนี้' : 'จำได้ครบทุกใบในชุดนี้แล้ว'}
          </Text>
          <Text className="text-black/60 text-base text-center mt-3">
            เปลี่ยนกลุ่มหรือตัวกรองได้ที่ปุ่มมุมขวาบน
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24, paddingBottom: 130 }}>
          <View className="flex-row items-center justify-between w-full px-2">
            <Pressable onPress={() => slideTo(-1)} hitSlop={16}>
              <Ionicons name="chevron-back" size={48} color="#1E1E1E" />
            </Pressable>

            <GestureDetector gesture={pan}>
              <Animated.View style={cardStyle}>
                <Image
                  source={karutaImages[card.id]}
                  style={{ width: cardWidth, height: cardWidth * (279 / 193), borderRadius: 12 }}
                  resizeMode="cover"
                />
              </Animated.View>
            </GestureDetector>

            <Pressable onPress={() => slideTo(1)} hitSlop={16}>
              <Ionicons name="chevron-forward" size={48} color="#1E1E1E" />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3 mt-7 mb-4">
            <Text className="text-black text-2xl">ไพ่ใบนี้คืออะไร?</Text>
            <TextButton label="วิธีจำ" onPress={() => router.push(`/mnemonic/${card.id}` as any)} />
          </View>

          {/* ตัวเลือกชุดใหม่ค่อยๆ โผล่ขึ้นมาทุกครั้งที่เปลี่ยนไพ่ */}
          <Animated.View
            key={card.id}
            entering={FadeIn.duration(300)}
            style={{ rowGap: 26, alignItems: 'center', width: '100%', paddingHorizontal: 32 }}
          >
            {options.map((opt) => (
              <AnswerOption
                key={opt.id}
                label={opt.kijimari}
                state={stateOf(opt.id)}
                disabled={pickedId !== null}
                onPress={() => answer(opt.id)}
              />
            ))}
          </Animated.View>
        </ScrollView>
      )}

      <BottomNavbar />
    </View>
  );
}
