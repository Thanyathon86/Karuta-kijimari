import { useProgressStore } from '../store/useProgressStore';

// ดึง progress จริงจาก store (เก็บ offline ผ่าน AsyncStorage) — กด "เริ่มเรียนใหม่" แล้วหน้า Main Menu จะกลับเป็น 0
export function useLearningProgress() {
  const learned = useProgressStore((state) => state.learnedIds.length);
  const total = useProgressStore((state) => state.totalCards);

  const remain = total - learned;
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);

  return { learned, remain, total, percent };
}
