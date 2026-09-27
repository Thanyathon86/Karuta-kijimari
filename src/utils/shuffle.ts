/** สุ่มสลับลำดับ (Fisher–Yates) คืน array ใหม่ ไม่แก้ของเดิม */
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
