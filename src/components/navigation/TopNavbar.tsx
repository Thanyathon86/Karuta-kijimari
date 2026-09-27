import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TopNavbarProps = {
  title?: string;
  showSort?: boolean;
  sortLabel?: string;
  onSortPress?: () => void;
  /** ใส่ component กำหนดเองแทนช่อง sort เดิม (เช่น GroupSelector ใน Gallery) */
  rightSlot?: React.ReactNode;
};

export default function TopNavbar({
  title,
  showSort = false,
  sortLabel = 'Sort',
  onSortPress,
  rightSlot,
}: TopNavbarProps) {
  // ดันเนื้อหาลงใต้แถบสถานะ (เวลา/แบต) ไม่ให้ทับปุ่ม — พื้นเขียวยังเต็มถึงขอบบนจอ
  const { top } = useSafeAreaInsets();

  return (
    <View
      className="w-full bg-[#A1BC98] flex-row items-center justify-between px-5"
      style={{ paddingTop: top, height: 70 + top }}
    >
      <Pressable
        onPress={() => router.back()}
        className="w-10 h-10 bg-[#D2DCB6] rounded-xl items-center justify-center"
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={20} color="#1D1B20" />
      </Pressable>

      {title ? (
        <Text className="text-black text-xl" numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
      )}

      {rightSlot ? (
        rightSlot
      ) : showSort ? (
        <Pressable
          onPress={onSortPress}
          className="h-10 px-4 bg-[#D2DCB6] rounded-2xl items-center justify-center"
          hitSlop={8}
        >
          <Text className="text-black text-sm">{sortLabel}</Text>
        </Pressable>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
}