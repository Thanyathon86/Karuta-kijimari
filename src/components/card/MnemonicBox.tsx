import { View, Image } from 'react-native';

import { karutaImages } from '../../data/karutaImages';
import { Mark } from '../../data/mnemonics';

type MnemonicBoxProps = {
  cardId: number;
  width: number;
  /** ตัวอักษรบนไพ่ 3 แถว (ใช้คำนวณระยะห่างตัวอักษร) */
  columns: [string, string, string];
  /** ตัวที่ต้องวง ตามคู่มือ */
  marks: Mark[];
};

// ตำแหน่งตัวอักษรบนรูปไพ่ (สัดส่วนของรูป) — แถวแนวตั้ง 3 แถว เรียงจากขวาไปซ้าย
const COL_X = [0.795, 0.495, 0.195];
const TEXT_TOP = 0.08;
const TEXT_SPAN = 0.84;
const CARD_RATIO = 1.43; // สูง / กว้าง ของรูปไพ่

/** รูปไพ่ + วงรอบตัวอักษรที่ใช้จำ (วงเดียว หรือวงยาวครอบหลายตัว) */
export default function MnemonicBox({ cardId, width, columns, marks }: MnemonicBoxProps) {
  const height = width * CARD_RATIO;
  const size = width * 0.2;

  return (
    <View style={{ width, height }}>
      <Image source={karutaImages[cardId]} style={{ width, height, borderRadius: 8 }} resizeMode="stretch" />
      {marks.map(([col, row, count = 1, dir], i) => {
        // แถวที่ยาวเกิน 5 ตัวบนไพ่จะเขียนถี่ขึ้น
        const step = (TEXT_SPAN / Math.max(5, columns[col].length)) * height;
        const x = COL_X[col] * width;
        const y = TEXT_TOP * height + (row + 0.5) * step;
        const horizontal = dir === 'h';
        const spanX = horizontal ? (COL_X[col] - COL_X[col + count - 1]) * width : 0;
        const spanY = horizontal ? 0 : (count - 1) * step;

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x - spanX - size / 2,
              top: y - size / 2,
              width: size + spanX,
              height: size + spanY,
              borderRadius: size / 2,
              borderWidth: 3,
              borderColor: '#F2A900',
            }}
          />
        );
      })}
    </View>
  );
}
