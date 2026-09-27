import { KIMARIJI_KANA, MNEMONICS, TORIFUDA } from '../data/mnemonics';

/** ข้อมูลวิธีจำของไพ่ 1 ใบ (คำขึ้นต้น + ตัวอักษรบนไพ่ + ตัวที่วง + คำอธิบาย) */
export function getMnemonic(cardId: number) {
  return {
    kimariji: KIMARIJI_KANA[cardId] ?? '',
    columns: TORIFUDA[cardId] ?? ['', '', ''],
    marks: MNEMONICS[cardId]?.marks ?? [],
    lines: MNEMONICS[cardId]?.lines ?? [],
  };
}

/** แยกข้อความเป็นช่วงๆ บอกว่าช่วงไหนเป็นฮิรางานะ (ใช้ไฮไลต์สีชมพู) */
export function splitKana(text: string) {
  return text
    .split(/([ぁ-ゟ]+)/)
    .filter(Boolean)
    .map((part) => ({ part, isKana: /^[ぁ-ゟ]+$/.test(part) }));
}
