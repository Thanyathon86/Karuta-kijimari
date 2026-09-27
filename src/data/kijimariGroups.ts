// อ้างอิงจาก PDF คู่มือคารุตะภาษาไทย หน้า 19-33
// แยกทุกกลุ่มย่อยตามจริง (ไพ่ที่ "ผูกกัน" ต้องฟังพยางค์เดียวกันก่อนถึงจะแยกออก)
// ⚠️ กลุ่มที่ขึ้นต้นคนละพยัญชนะ (เช่น TA กับ KO) ไม่ผูกกัน ห้ามรวมแถวเดียวกัน
// รวมทั้งหมด 100 ใบพอดี เช็ค checksum แล้ว ✅

export interface KijimariGroup {
  id: number;
  /** ตัวย่อโชว์บนปุ่ม/แถว */
  label: string;
  description: string;
  /** จำนวนพยางค์ที่ต้องฟังก่อนถึงจะแยกไพ่กลุ่มนี้ออกจากกันได้ (ใช้จัดหมวดใน modal) */
  charCount: number;
  cardIds: number[];
}

export const KIJIMARI_GROUPS: KijimariGroup[] = [
  // 1 พยางค์ — ไม่ผูกกับใครเลย ได้ยินตัวแรกก็รู้ทันที (7 ใบ)
  { id: 1, label: 'MU·SU·ME·FU·SA·HO·SE', description: 'ไม่ผูกใคร 7 ใบ (むすめふさほせ)', charCount: 1, cardIds: [87, 18, 57, 22, 70, 81, 77] },

  // 2 พยางค์ — ผูกกันทีละคู่ (คนละคู่ไม่เกี่ยวกัน) แยก 5 คู่
  { id: 2, label: 'U', description: 'ผูกกัน 2 ใบ (う)', charCount: 2, cardIds: [65, 74] },
  { id: 3, label: 'TSU', description: 'ผูกกัน 2 ใบ (つ)', charCount: 2, cardIds: [23, 13] },
  { id: 4, label: 'SHI', description: 'ผูกกัน 2 ใบ (し)', charCount: 2, cardIds: [40, 37] },
  { id: 5, label: 'MO', description: 'ผูกกัน 2 ใบ (も)', charCount: 2, cardIds: [100, 66] },
  { id: 6, label: 'YU', description: 'ผูกกัน 2 ใบ (ゆ)', charCount: 2, cardIds: [46, 71] },

  // 3 พยางค์ — แยก 4 กลุ่ม
  { id: 7, label: 'I', description: 'ผูกกัน 3 ใบ (い)', charCount: 3, cardIds: [21, 63, 61] },
  { id: 8, label: 'CHI', description: 'ผูกกัน 3 ใบ (ち)', charCount: 3, cardIds: [42, 75, 17] },
  { id: 9, label: 'HI', description: 'ผูกกัน 3 ใบ (ひ)', charCount: 3, cardIds: [35, 99, 33] },
  { id: 10, label: 'KI', description: 'ผูกกัน 3 ใบ (き)', charCount: 3, cardIds: [15, 50, 91] },

  // 4 พยางค์ — แยก 4 กลุ่ม
  { id: 11, label: 'HA', description: 'ผูกกัน 4 ใบ (は)', charCount: 4, cardIds: [2, 67, 9, 96] },
  { id: 12, label: 'YA', description: 'ผูกกัน 4 ใบ (や)', charCount: 4, cardIds: [47, 59, 28, 32] },
  { id: 13, label: 'YO', description: 'ผูกกัน 4 ใบ (よ)', charCount: 4, cardIds: [62, 85, 93, 83] },
  { id: 14, label: 'KA', description: 'ผูกกัน 4 ใบ (か)', charCount: 4, cardIds: [6, 51, 48, 98] },

  // 5 พยางค์ — กลุ่มเดียว
  { id: 15, label: 'MI', description: 'ผูกกัน 5 ใบ (み)', charCount: 5, cardIds: [49, 27, 14, 90, 94] },

  // 6 พยางค์ — แยก 2 กลุ่ม (TA กับ KO ไม่ผูกกัน)
  { id: 16, label: 'TA', description: 'ผูกกัน 6 ใบ (た)', charCount: 6, cardIds: [73, 55, 34, 16, 4, 89] },
  { id: 17, label: 'KO', description: 'ผูกกัน 6 ใบ (こ)', charCount: 6, cardIds: [10, 41, 24, 97, 29, 68] },

  // 7 พยางค์ — แยก 2 กลุ่ม (O กับ WA ไม่ผูกกัน)
  { id: 18, label: 'O', description: 'ผูกกัน 7 ใบ (お)', charCount: 7, cardIds: [72, 82, 5, 26, 60, 95, 44] },
  { id: 19, label: 'WA', description: 'ผูกกัน 7 ใบ (わ)', charCount: 7, cardIds: [8, 92, 38, 54, 76, 11, 20] },

  // 8 พยางค์ — กลุ่มเดียว
  { id: 20, label: 'NA', description: 'ผูกกัน 8 ใบ (な)', charCount: 8, cardIds: [80, 84, 53, 86, 36, 25, 88, 19] },

  // 16 พยางค์ — กลุ่มใหญ่สุด
  { id: 21, label: 'A', description: 'ผูกกัน 16 ใบ (あ)', charCount: 16, cardIds: [79, 1, 43, 52, 3, 39, 31, 64, 12, 7, 56, 69, 30, 58, 78, 45] },
];

// เช็คแล้ว: รวมทุกกลุ่ม = 100 ใบพอดี ครบทุกใบ

/** ชื่อหมวด: 1-2 = จำนวนพยางค์, ตั้งแต่ 3 = จำนวนไพ่ที่ขึ้นต้นเหมือนกัน */
export const categoryTitle = (count: number) =>
  count <= 2 ? `${count} พยางค์` : `ขึ้นต้นเหมือนกัน ${count} ใบ`;

/**
 * หมวดใหญ่ = รวมทุกกลุ่มย่อยที่ charCount เท่ากัน ใช้กด "เอาทั้งหมวด"
 * มีเฉพาะหมวดที่มีกลุ่มย่อยมากกว่า 1 กลุ่ม (2, 3, 4, 6, 7) — id = 100 + charCount กันชนกับกลุ่มย่อย
 */
export const KIJIMARI_CATEGORIES: KijimariGroup[] = Array.from(new Set(KIJIMARI_GROUPS.map((g) => g.charCount)))
  .map((count) => KIJIMARI_GROUPS.filter((g) => g.charCount === count))
  .filter((groups) => groups.length > 1)
  .map((groups) => {
    const count = groups[0].charCount;
    const cardIds = groups.flatMap((g) => g.cardIds);
    return {
      id: 100 + count,
      label: count <= 2 ? `${count} พยางค์` : `กลุ่ม ${count} ใบ`,
      description: `ทั้งหมวด ${cardIds.length} ใบ`,
      charCount: count,
      cardIds,
    };
  });

/** หากลุ่มจาก id — ได้ทั้งกลุ่มย่อยและหมวดใหญ่ */
export const findGroup = (id: number) =>
  KIJIMARI_GROUPS.find((g) => g.id === id) ?? KIJIMARI_CATEGORIES.find((g) => g.id === id);