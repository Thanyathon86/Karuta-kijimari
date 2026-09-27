import { Pressable, Text } from 'react-native';

export type AnswerState = 'idle' | 'correct' | 'wrong';

type AnswerOptionProps = {
  label: string;
  state: AnswerState;
  onPress: () => void;
  disabled?: boolean;
};

// สีตัวอักษรตาม Figma: ถูก = เขียว, ผิด = แดง (เปลี่ยนแค่สีฟอนต์)
const COLORS: Record<AnswerState, string> = {
  idle: '#FFFFFF',
  correct: '#0AFF26',
  wrong: '#FF0000',
};

/** ปุ่มตัวเลือกคำตอบ 1 ข้อ */
export default function AnswerOption({ label, state, onPress, disabled }: AnswerOptionProps) {
  const color = COLORS[state];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="w-[201px] max-w-full h-[50px] bg-[#497833] rounded-[15px] items-center justify-center"
    >
      <Text className="text-2xl" style={{ color }} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}
