import { Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  className?: string;
};

export default function Button({ label, onPress, className = '' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[34px] bg-[#F1F3E0] border border-black rounded-[25px] items-center justify-center ${className}`}
    >
      <Text className="text-base text-black">{label}</Text>
    </Pressable>
  );
}