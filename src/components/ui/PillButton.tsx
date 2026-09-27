import { Pressable, Text } from 'react-native';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  /** solid = พื้นเขียวตัวขาว, outline = พื้นขาวตัวเขียว (ตาม Figma ปุ่ม ใช่/ไม่ใช่) */
  variant?: 'solid' | 'outline';
  className?: string;
};

/** ปุ่มสี่เหลี่ยมมน 50px ใช้ในหน้าตั้งค่า (ภาษา, ยืนยันเริ่มเรียนใหม่) */
export default function PillButton({ label, onPress, variant = 'solid', className = '' }: PillButtonProps) {
  const solid = variant === 'solid';
  return (
    <Pressable
      onPress={onPress}
      className={`h-[50px] rounded-[15px] items-center justify-center ${solid ? 'bg-[#346739]' : 'bg-white'} ${className}`}
    >
      <Text className={`text-2xl ${solid ? 'text-white' : 'text-[#346739]'}`}>{label}</Text>
    </Pressable>
  );
}
