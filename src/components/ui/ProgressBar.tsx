import { View, Text } from 'react-native';

type ProgressBarProps = {
  percent: number; // 0-100
};

export default function ProgressBar({ percent }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View className="w-full">
      <View className="h-[10px] bg-[#F1F3E0] border border-black rounded-full overflow-hidden">
        <View
          className="h-full bg-[#346739] rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </View>
      <Text className="text-[10px] leading-3 text-black mt-1">
        {clamped}% Complete
      </Text>
    </View>
  );
}