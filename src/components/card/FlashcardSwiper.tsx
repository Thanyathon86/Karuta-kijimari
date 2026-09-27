import { Image, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { karutaImages } from '../../data/karutaImages';
import { Karuta } from '../../types/karuta';

type FlashcardSwiperProps = {
  card: Karuta;
  width: number;
  /** true = ใบบนสุดที่ปัดได้ */
  enabled: boolean;
  /** true = ใบถัดไปที่รออยู่ข้างใต้ (ย่อเล็กลงนิดหน่อย) */
  behind?: boolean;
  /** เรียกตอนนิ้วเริ่มลากไพ่ (ใช้เริ่มจับเวลา) */
  onGrab: () => void;
  /** เรียกทันทีที่ปล่อยนิ้วแล้วไพ่ถูกปัดออก → ใบถัดไปปัดต่อได้เลย ไม่ต้องรอไพ่ปลิวจบ */
  onRelease: (card: Karuta) => void;
  /** เรียกเมื่อไพ่ปลิวพ้นจอแล้ว (ใช้ลบออกจากจอ) */
  onGone: (card: Karuta) => void;
};

/** ความเร็วนิ้วขั้นต่ำ (px/s) ที่นับว่า "สะบัด" */
const FLING_SPEED = 800;
const EASE_OUT = Easing.out(Easing.quad);

/** ไพ่ 1 ใบ — สะบัดแรงปลิวไกลและเร็ว, ลากเบาๆ ไหลออกช้าๆ, ลากไม่พอเด้งกลับ */
export default function FlashcardSwiper({
  card,
  width,
  enabled,
  behind = false,
  onGrab,
  onRelease,
  onGone,
}: FlashcardSwiperProps) {
  const screen = useWindowDimensions();
  const offScreen = Math.hypot(screen.width, screen.height);
  const height = width * (381 / 263); // สัดส่วนไพ่จาก Figma

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const spin = useSharedValue(0);
  const scale = useDerivedValue(() => withTiming(behind ? 0.95 : 1, { duration: 150 }), [behind]);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => scheduleOnRN(onGrab))
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY;
    })
    .onEnd((e) => {
      const speed = Math.hypot(e.velocityX, e.velocityY);
      const isFling = speed >= FLING_SPEED;

      // ลากไม่ไกลพอและไม่ได้สะบัด → เด้งกลับที่เดิม
      if (!isFling && Math.abs(x.value) < width * 0.4) {
        x.value = withSpring(0);
        y.value = withSpring(0);
        return;
      }

      scheduleOnRN(onRelease, card);

      // ทิศทาง: สะบัดใช้ทิศของความเร็วนิ้ว, ลากเบาใช้ทิศที่ลากไป
      const len = isFling ? speed : Math.hypot(x.value, y.value);
      const dirX = (isFling ? e.velocityX : x.value) / len;
      const dirY = (isFling ? e.velocityY : y.value) / len;

      // ยิ่งแรงยิ่งไปไกลและเร็ว แต่อย่างน้อยต้องพ้นจอ
      const distance = Math.max(offScreen, speed * 0.35);
      const duration = Math.min(700, Math.max(250, (distance / Math.max(speed, 600)) * 1000));
      const config = { duration, easing: EASE_OUT };

      spin.value = withTiming(e.velocityX / 40, config);
      y.value = withTiming(y.value + dirY * distance, config);
      x.value = withTiming(x.value + dirX * distance, config, (finished) => {
        if (finished) scheduleOnRN(onGone, card);
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${(x.value / width) * 15 + spin.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ position: 'absolute', width, height }, animatedStyle]}>
        <Image
          source={karutaImages[card.id]}
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          resizeMode="cover"
        />
      </Animated.View>
    </GestureDetector>
  );
}
