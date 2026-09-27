import { useCallback, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, { ZoomIn } from 'react-native-reanimated';

import TopNavbar from '../components/navigation/TopNavbar';
import BottomNavbar from '../components/navigation/BottomNavbar';
import FlashcardSwiper from '../components/card/FlashcardSwiper';
import Button from '../components/ui/Button';
import { useKarutaTimer, formatTime } from '../hook/useKarutaTimer';
import karutaData from '../data/karuta.json';
import { Karuta, KarutaData } from '../types/karuta';
import { shuffle } from '../utils/shuffle';

const ALL_CARDS = (karutaData as KarutaData).cards;

export default function Flashcard() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.65, 320); // Figma: 263 บนจอ 402
  const cardHeight = cardWidth * (381 / 263);

  const [deck, setDeck] = useState(() => shuffle(ALL_CARDS));
  const [index, setIndex] = useState(0);
  /** ไพ่ที่ปัดไปแล้วแต่ยังปลิวอยู่บนจอ */
  const [flying, setFlying] = useState<Karuta[]>([]);
  const timer = useKarutaTimer();
  const { reset: resetTimer } = timer;

  const restart = useCallback(() => {
    setDeck(shuffle(ALL_CARDS));
    setIndex(0);
    setFlying([]);
    resetTimer();
  }, [resetTimer]);

  // ออกจากหน้านี้ = เลิกจับเวลาและเริ่มสำรับใหม่เมื่อกลับมา
  useFocusEffect(useCallback(() => restart, [restart]));

  const current = deck[index];
  const next = deck[index + 1];
  const lastSwiped = deck[index - 1];
  const done = !current && flying.length === 0;

  const handleGrab = () => {
    if (!timer.running && index === 0) timer.start();
  };

  // ปล่อยนิ้วปุ๊บ ใบถัดไปขึ้นมาให้ปัดต่อทันที
  const handleRelease = (card: Karuta) => {
    setFlying((f) => [...f, card]);
    setIndex((i) => i + 1);
    if (index + 1 === deck.length) timer.stop();
  };

  const handleGone = (card: Karuta) => setFlying((f) => f.filter((c) => c.id !== card.id));

  // ใบถัดไป (ข้างใต้) → ใบบนสุด → ใบที่กำลังปลิว (บนสุดของจอ)
  // ใช้ key = id ตัวเดียวกันตลอด ไพ่เลยไม่กระพริบตอนเลื่อนจาก "ใบถัดไป" เป็น "ใบบนสุด"
  const stack = [next, current, ...flying].filter(Boolean) as Karuta[];

  return (
    <View className="flex-1 bg-[#F1F3E0]">
      <TopNavbar
        rightSlot={
          <View className="h-10 px-4 bg-[#D2DCB6] rounded-2xl items-center justify-center">
            <Text className="text-black text-sm">{formatTime(timer.elapsed)}</Text>
          </View>
        }
      />

      {done ? (
        <View className="flex-1 items-center justify-center px-10 pb-32">
          <Text className="text-black text-2xl">ครบ {deck.length} ใบแล้ว!</Text>
          <Text className="text-black text-5xl mt-3">{formatTime(timer.elapsed)}</Text>
          <Button label="เล่นอีกครั้ง" onPress={restart} className="w-full mt-8" />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center pb-32">
          <Text className="text-black text-base mb-3">
            {index} / {deck.length}
          </Text>

          <View style={{ width: cardWidth, height: cardHeight }}>
            {stack.map((card) => (
              <FlashcardSwiper
                key={card.id}
                card={card}
                width={cardWidth}
                enabled={card === current}
                behind={card === next}
                onGrab={handleGrab}
                onRelease={handleRelease}
                onGone={handleGone}
              />
            ))}
          </View>

          {/* kijimari ของใบที่เพิ่งปัด — ขยายขึ้นมาใหม่ทุกครั้งที่ปัด */}
          <View className="h-16 mt-5 items-center justify-center">
            {lastSwiped && (
              <Animated.View
                key={index}
                entering={ZoomIn.duration(200)}
                style={{ backgroundColor: '#346739', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 8 }}
              >
                <Text className="text-white text-2xl">{lastSwiped.kijimari}</Text>
              </Animated.View>
            )}
          </View>
        </View>
      )}

      <BottomNavbar />
    </View>
  );
}
