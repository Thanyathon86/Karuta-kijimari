// Type ของไพ่คารุตะ 1 ใบ — โครงสร้างต้องตรงกับ field ใน src/data/karuta.json ทุกตัว

export interface Karuta {
  id: number;
  /** คำขึ้นต้นที่ใช้จำแยกไพ่ (決まり字) เช่น "Akino", "Harusu" */
  kijimari: string;
  /** กลอนท่อนต้น (ภาษาโรมันจิ) */
  firstHalf: string;
  /** กลอนท่อนปลาย (ภาษาโรมันจิ) */
  secondHalf: string;
  /** คำแปลภาษาไทย */
  translate: string;
  /** ความหมาย/บริบทของกลอนบทนี้ */
  meaning: string;
  /** ชื่อผู้แต่ง */
  author: string;
  /** ชื่อไฟล์รูป เช่น "1.jpg" — บางใบอาจว่างถ้ายังไม่มีรูป (เช่น id 7) */
  img: string;
}

export interface KarutaData {
  cards: Karuta[];
}