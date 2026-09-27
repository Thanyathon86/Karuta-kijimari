import { useProgressStore } from '../store/useProgressStore';

// ดึง progress จริงจาก store (persist offline ผ่าน AsyncStorage แล้ว)
export function useLearningProgress() {
  const learnedIds = useProgressStore((state) => state.learnedIds);
  const total = useProgressStore((state) => state.totalCards);

  const learned = learnedIds.length;
  const remain = total - learned;
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);

  return { learned, remain, total, percent };
}