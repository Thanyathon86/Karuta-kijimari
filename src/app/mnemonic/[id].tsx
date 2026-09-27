import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import TopNavbar from '../../components/navigation/TopNavbar';
import BottomNavbar from '../../components/navigation/BottomNavbar';
import MnemonicBox from '../../components/card/MnemonicBox';
import { getMnemonic, splitKana } from '../../utils/mnemonic';
import karutaData from '../../data/karuta.json';
import { KarutaData } from '../../types/karuta';

const ALL_CARDS = (karutaData as KarutaData).cards;

/** ข้อความที่ไฮไลต์ตัวฮิรางานะเป็นสีชมพู แบบในคู่มือ */
function KanaText({ text }: { text: string }) {
  return (
    <Text className="text-black text-base leading-6" textBreakStrategy="simple">
      {splitKana(text).map(({ part, isKana }, i) =>
        isKana ? (
          <Text key={i} className="text-[#E0457B]">
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}

/** หน้าวิธีจำไพ่ 1 ใบ ตามคู่มือ — /mnemonic/3 (เปิดจาก Gallery และ Learning) */
export default function MnemonicPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const card = ALL_CARDS.find((c) => String(c.id) === id);

  if (!card) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F1F3E0]">
        <Text className="text-black">ไม่พบไพ่ใบนี้</Text>
      </View>
    );
  }

  const { kimariji, columns, marks, lines } = getMnemonic(card.id);

  return (
    <View className="flex-1 bg-[#F1F3E0]">
      <TopNavbar title="วิธีจำ" />

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 130 }}>
        {/* คำขึ้นต้น (kimariji) + กลอนท่อนบน */}
        <Text className="text-[#C62828] text-4xl">{kimariji}</Text>
        <Text className="text-[#497833] text-base mt-1">{card.firstHalf}</Text>

        <View className="flex-row items-start gap-5 mt-6">
          <MnemonicBox cardId={card.id} width={Math.min(width * 0.4, 220)} columns={columns} marks={marks} />

          <View className="flex-1 gap-y-2">
            {lines.length > 0 ? (
              lines.map((line, i) => <KanaText key={i} text={line} />)
            ) : (
              <Text className="text-black/60 text-base" textBreakStrategy="simple">
                สังเกตตัวที่วงไว้ (ใบนี้คู่มือยังไม่มีคำอธิบาย)
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}
