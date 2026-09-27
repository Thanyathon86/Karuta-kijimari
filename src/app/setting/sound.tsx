import { View, Text } from 'react-native';

import TopNavbar from '../../components/navigation/TopNavbar';
import Slider from '../../components/ui/Slider';
import { useSettingsStore } from '../../store/useSettingStore';

export default function SoundSetting() {
  const volume = useSettingsStore((s) => s.soundVolume);
  const setVolume = useSettingsStore((s) => s.setSoundVolume);

  return (
    <View className="flex-1 bg-[#D2DCB6]">
      <TopNavbar title="เสียง" />

      <View className="px-5 pt-12">
        <View className="flex-row justify-between items-end mb-3">
          <Text className="text-black text-2xl">ระดับเสียงหลัก</Text>
          <Text className="text-black text-2xl">{volume}</Text>
        </View>

        <Slider value={volume} min={1} max={10} onChange={setVolume} />

        <View className="flex-row justify-between mt-4">
          <Text className="text-black text-2xl">1</Text>
          <Text className="text-black text-2xl">10</Text>
        </View>
      </View>
    </View>
  );
}
