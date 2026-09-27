import { useEffect } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const MENU = [
  { label: 'เสียง', href: '/setting/sound' },
  { label: 'ภาษา', href: '/setting/language' },
  { label: 'เริ่มเรียนใหม่', href: '/setting/reset-confirm' },
  { label: 'สนับสนุน', href: '/setting/support' },
] as const;

const TOP_NAVBAR_HEIGHT = 70;
const GAP = 16; // ช่องว่างระหว่าง TopNavbar กับแผ่น

/**
 * แผ่นตั้งค่าที่สไลด์ขึ้นจากด้านล่าง — วางทับหน้าปัจจุบันแต่อยู่ใต้ BottomNavbar
 * (BottomNavbar เป็นคนเปิด/ปิด)
 */
export default function SettingSheet({ visible, onClose }: SettingSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // แผ่นหยุดใต้ TopNavbar ไม่ขึ้นไปทับ
  const top = insets.top + TOP_NAVBAR_HEIGHT + GAP;
  // ซ่อนให้พ้นจอจริง (เผื่อแถบปุ่ม Android ด้านล่าง)
  const hiddenY = height + insets.bottom + 100;
  // 0 = ปิด, 1 = เปิด — ใช้ค่าเดียวขับทั้งแผ่นที่สไลด์และพื้นหลังที่หรี่ลง
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, progress]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * hiddenY }],
  }));
  const dimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const open = (href: (typeof MENU)[number]['href']) => {
    onClose();
    router.push(href);
  };

  return (
    <>
      {/* พื้นหลังหรี่ลง ให้แผ่นแยกจากหน้าเดิมชัดทุกหน้า (แม้พื้นหน้าจะสีเดียวกับแผ่น) — แตะเพื่อปิด */}
      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
          { pointerEvents: visible ? 'auto' : 'none' },
          dimStyle,
        ]}
      >
        <Pressable onPress={onClose} style={{ flex: 1 }} />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#A1BC98',
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            paddingTop: 44,
            pointerEvents: visible ? 'auto' : 'none',
          },
          slideStyle,
        ]}
      >
        <Pressable onPress={onClose} hitSlop={12} className="self-end mr-10 mb-4">
          <Ionicons name="close-circle-outline" size={34} color="#1E1E1E" />
        </Pressable>

        {MENU.map((item) => (
          <Pressable
            key={item.href}
            onPress={() => open(item.href)}
            className="border-t border-white px-6 py-5 active:bg-white/20"
          >
            <Text className="text-black text-2xl">{item.label}</Text>
          </Pressable>
        ))}
        <View className="border-t border-white" />
      </Animated.View>
    </>
  );
}
