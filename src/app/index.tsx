import { View, Text, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import BottomNavbar from '../components/navigation/BottomNavbar';
import { useLearningProgress } from '../hook/useLearningProgress';

export default function MainMenu() {
  const { learned, remain, percent } = useLearningProgress();
  const { width } = useWindowDimensions();

  // ปรับขนาด title ตามความกว้างจอจริง กันข้อความตัด "..." บนจอแคบ
  // cap ไว้ที่ text-3xl สำหรับมือถือทั่วไป กัน font กระโดดใหญ่เกินจนล้นบนจอกว้างขึ้นนิดเดียว
  const titleSizeClass =
    width < 350 ? 'text-2xl' : width < 700 ? 'text-3xl' : 'text-4xl';

  return (
    <View className="flex-1 bg-[#A1BC98] px-6 pt-[17%]">
      {/* version label - top right, matches Figma */}
      <Text className="absolute top-[1.5%] right-4 text-xs text-black">
        version 1.0.0
      </Text>

      {/* Title - shrinks to fit one line on any screen width */}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`${titleSizeClass} text-black font-bold text-center`}
      >
        Karuta Kijimari Tutor
      </Text>
      <Text className="text-xl text-black text-center mt-2">
        かるた決まり字チューター
      </Text>

      {/* Stats card: Learn / Remain (gap from subtitle: 15px in Figma) */}
      <View className="relative flex-row bg-[#F1F3E0] border border-black rounded-[25px] py-8 mt-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-black">Learn</Text>
          <Text className="text-4xl text-black mt-2">{learned}</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-black">Remain</Text>
          <Text className="text-4xl text-black mt-2">{remain}</Text>
        </View>

        {/* เส้นแบ่งเต็มความสูงกล่อง ไม่อิงตามเนื้อหา/padding */}
        <View className="absolute top-0 bottom-0 left-1/2 w-px bg-black" />
      </View>

      {/* Start Learning button (gap from card: 17px in Figma) */}
      <Button
        label="Start Learning"
        onPress={() => router.push('/learning')}
        className="mt-4"
      />

      {/* Progress bar (gap from button: 6px in Figma) */}
      <View className="mt-1">
        <ProgressBar percent={percent} />
      </View>

      {/* Description (gap from "0% Complete": 8px in Figma) */}
      <Text className="text-lg leading-6 text-black text-center mt-2">
        เรียนรู้และจดจำบทกลอนคารุตะครบทั้ง 100 ใบ
        พร้อมวิธีจำที่ช่วยให้คุณจับคู่กลอนต้นและกลอนปลายได้อย่างแม่นยำ
      </Text>

      <BottomNavbar />
    </View>
  );
}