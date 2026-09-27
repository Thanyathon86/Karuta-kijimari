import { Pressable, Image, Text, View } from 'react-native';
import { Karuta } from '../../types/karuta';
import { karutaImages } from '../../data/karutaImages';

type KarutaCardProps = {
  card: Karuta;
  onPress?: () => void;
  /** ความกว้างการ์ด (px) - คำนวณจาก grid ให้ responsive ตามความกว้างจอ */
  size?: number;
  /** โชว์ label kijimari ใต้รูปไหม (Gallery ใช้ true, Flashcard อาจไม่ต้องโชว์ตอนพลิกไพ่) */
  showLabel?: boolean;
};

export default function KarutaCard({
  card,
  onPress,
  size = 100,
  showLabel = true,
}: KarutaCardProps) {
  const image = karutaImages[card.id];
  // อัตราส่วนการ์ดอิงจาก Figma (79 x 114)
  const cardHeight = size * (114 / 79);

  return (
    <Pressable onPress={onPress} style={{ width: size }} className="items-center">
      <View
        className="bg-[#D2DCB6] rounded-lg overflow-hidden items-center justify-center"
        style={{ width: size, height: cardHeight }}
      >
        {image ? (
          <Image
            source={image}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Text className="text-xs text-black text-center px-1">ไม่มีรูป</Text>
        )}
      </View>

      {showLabel && (
        <Text className="text-black text-sm mt-1" numberOfLines={1}>
          {card.kijimari}
        </Text>
      )}
    </Pressable>
  );
}