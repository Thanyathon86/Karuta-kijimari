import { Pressable, Text } from 'react-native';

type TextButtonProps = {
  label: string;
  onPress: () => void;
  /** true = พื้นเขียวทึบ (ใช้บอกว่ากำลังเปิด/เล่นอยู่) */
  active?: boolean;
};

/** ปุ่มตัวหนังสือล้วนแบบ minimal ในกรอบมนเส้นบาง (ฟังเสียง / วิธีจำ / คำใบ้) */
export default function TextButton({ label, onPress, active = false }: TextButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className={`px-3 py-1 rounded-full border border-[#346739] ${active ? 'bg-[#346739]' : ''}`}
    >
      <Text className={`text-sm ${active ? 'text-white' : 'text-[#346739]'}`}>{label}</Text>
    </Pressable>
  );
}
