import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

import TopNavbar from '../../components/navigation/TopNavbar';
import PillButton from '../../components/ui/PillButton';
import { useProgressStore } from '../../store/useProgressStore';

export default function ResetConfirm() {
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const [done, setDone] = useState(false);

  const confirm = () => {
    resetProgress();
    setDone(true);
  };

  return (
    <View className="flex-1 bg-[#D2DCB6]">
      <TopNavbar title="เริ่มเรียนใหม่" />

      <View className="px-7 pt-[50%]">
        {done ? (
          <Text className="text-black text-2xl text-center">ข้อมูลถูกลบเรียบร้อยเเล้ว</Text>
        ) : (
          <>
            <Text className="text-black text-2xl text-center">คุณต้องการที่จะเริ่มเรียนใหม่ใช่ไหม ?</Text>
            <View className="flex-row justify-between mt-9">
              <PillButton label="ไม่ใช่" variant="outline" onPress={() => router.back()} className="w-[47%]" />
              <PillButton label="ใช่" onPress={confirm} className="w-[47%]" />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
