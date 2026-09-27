import { View, Text, Image, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import TopNavbar from '../../components/navigation/TopNavbar';
import GroupSelector from '../../components/navigation/GroupSelector';
import BottomNavbar from '../../components/navigation/BottomNavbar';
import karutaData from '../../data/karuta.json';
import { karutaImages } from '../../data/karutaImages';
import { KarutaData } from '../../types/karuta';
import { filterAndSortCards, SortOrder } from '../../hook/useKarutaGroupFilter';
import { usePlayChant } from '../../hook/usePlayChant';
import TextButton from '../../components/ui/TextButton';

const ALL_CARDS = (karutaData as KarutaData).cards;
const EASE_OUT = Easing.out(Easing.cubic);

export default function GalleryDetail() {
  const { id, group, order } = useLocalSearchParams<{
    id: string;
    group?: string;
    order?: string;
  }>();

  // แปลง query param กลับเป็นค่าใช้งานจริง (group ว่าง = ดูทั้งหมด)
  const groupId = group && group !== '' ? Number(group) : null;
  const sortOrder: SortOrder = order === 'desc' ? 'desc' : 'asc';

  // reconstruct list เดียวกับที่ gallery.tsx ใช้ตอนกดเข้ามา ปุ่ม prev/next จะได้เลื่อนตามลำดับในกลุ่มนี้ถูกต้อง
  const list = filterAndSortCards(ALL_CARDS, groupId, sortOrder);
  const currentIndex = list.findIndex((c) => String(c.id) === id);
  const card = list[currentIndex];
  const chant = usePlayChant(card?.id);

  // ---- animation เปลี่ยนไพ่: เฉพาะรูปไพ่เลื่อนซ้าย/ขวา แบบเดียวกับหน้า Learning ----
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.48; // ขนาดไพ่เท่าเดิม (48% ของจอ)
  const x = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(Math.abs(x.value) / width, 1) * 0.7,
    transform: [{ translateX: x.value }],
  }));

  if (!card) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F1F3E0]">
        <Text className="text-black">ไม่พบไพ่ใบนี้</Text>
      </View>
    );
  }

  const image = karutaImages[card.id];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < list.length - 1;

  /** dir 1 = ใบถัดไป, -1 = ใบก่อนหน้า — เปลี่ยนแค่ id แต่คง group/order เดิมไว้ (เรียกหลังใบเดิมเลื่อนพ้นจอ) */
  const change = (dir: number) => {
    router.setParams({ id: String(list[currentIndex + dir].id), group: group ?? '', order: sortOrder });
    x.value = dir * width;
    x.value = withTiming(0, { duration: 260, easing: EASE_OUT });
  };

  const slideTo = (dir: number) => {
    const canGo = dir === 1 ? hasNext : hasPrev;
    if (!canGo) {
      x.value = withSpring(0); // สุดชุดแล้ว เด้งกลับ
      return;
    }
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
      scheduleOnRN(slideTo, (fast ? e.velocityX : e.translationX) < 0 ? 1 : -1);
    });

  // เปลี่ยนกลุ่ม/ลำดับจากหน้านี้ได้เลย — ถ้าไพ่ใบนี้ไม่อยู่ในชุดใหม่ ให้ไปใบแรกของชุดนั้น
  const changeFilter = (nextGroup: number | null, nextOrder: SortOrder) => {
    const nextList = filterAndSortCards(ALL_CARDS, nextGroup, nextOrder);
    const nextId = nextList.some((c) => c.id === card.id) ? card.id : nextList[0].id;
    router.setParams({ id: String(nextId), group: nextGroup === null ? '' : String(nextGroup), order: nextOrder });
  };

  return (
    <View className="flex-1 bg-[#F1F3E0]">
      <TopNavbar
        rightSlot={
          <GroupSelector
            selectedGroup={groupId}
            onSelectGroup={(g) => changeFilter(g, sortOrder)}
            sortOrder={sortOrder}
            onToggleSortOrder={() => changeFilter(groupId, sortOrder === 'asc' ? 'desc' : 'asc')}
          />
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ตัวนับตำแหน่งอิงตามชุดที่เลือกอยู่ (ไม่ใช่ 1-100 เสมอไป) */}
        <Text className="text-black/60 text-sm text-center mt-4">
          {currentIndex + 1} / {list.length}
        </Text>

        <View>
          <View className="flex-row items-center justify-between px-4 mt-2">
            <Pressable
              onPress={() => slideTo(-1)}
              disabled={!hasPrev}
              hitSlop={16}
              style={{ opacity: hasPrev ? 1 : 0.25 }}
            >
              <Ionicons name="chevron-back" size={32} color="#1E1E1E" />
            </Pressable>

            <GestureDetector gesture={pan}>
              <Animated.View style={[{ width: cardWidth, height: cardWidth * (114 / 79) }, cardStyle]}>
                {image ? (
                  <Image source={image} style={{ width: '100%', height: '100%', borderRadius: 16 }} resizeMode="cover" />
                ) : (
                  <View className="flex-1 bg-[#D2DCB6] rounded-2xl items-center justify-center">
                    <Text className="text-black text-center px-2">ไม่มีรูปไพ่ใบนี้</Text>
                  </View>
                )}
              </Animated.View>
            </GestureDetector>

            <Pressable
              onPress={() => slideTo(1)}
              disabled={!hasNext}
              hitSlop={16}
              style={{ opacity: hasNext ? 1 : 0.25 }}
            >
              <Ionicons name="chevron-forward" size={32} color="#1E1E1E" />
            </Pressable>
          </View>

          {/* ข้อความไม่เลื่อนตาม แค่โหลดใหม่ (จางเข้า) ทุกครั้งที่เปลี่ยนไพ่ */}
          <Animated.View key={card.id} entering={FadeIn.duration(250)}>
            <View className="flex-row items-center justify-center gap-3 mt-4">
              <Text className="text-black text-2xl">{card.kijimari}</Text>
              <TextButton label={chant.playing ? 'หยุด' : 'ฟังเสียง'} active={chant.playing} onPress={chant.toggle} />
              <TextButton label="วิธีจำ" onPress={() => router.push(`/mnemonic/${card.id}` as any)} />
            </View>
            <Text className="text-black text-base text-center mt-2">{card.author}</Text>

            <View className="px-6 mt-8">
              <Text className="text-[#E2B82E] text-xl font-bold">First half</Text>
              <Text className="text-black text-lg mt-1">{card.firstHalf}</Text>

              <Text className="text-[#E2B82E] text-xl font-bold mt-6">Second half</Text>
              <Text className="text-black text-lg mt-1">{card.secondHalf}</Text>

              <Text className="text-lg leading-6 mt-8">
                <Text className="text-[#E2B82E] font-bold">คำแปลสรุป: </Text>
                <Text className="text-black">&quot;{card.translate}&quot;</Text>
              </Text>
              <Text className="text-lg leading-6 mt-6">
                <Text className="text-[#E2B82E] font-bold">ความหมายและบรรยากาศของไพ่: </Text>
                <Text className="text-black">{card.meaning}</Text>
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}