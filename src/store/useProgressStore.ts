import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface ProgressState {
  learnedIds: number[];
  totalCards: number;

  markAsLearned: (id: number) => void;
  markAsNotLearned: (id: number) => void;
  isLearned: (id: number) => boolean;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      learnedIds: [],
      totalCards: 100,

      markAsLearned: (id) => {
        const { learnedIds } = get();
        if (!learnedIds.includes(id)) {
          set({ learnedIds: [...learnedIds, id] });
        }
      },

      markAsNotLearned: (id) => {
        set({ learnedIds: get().learnedIds.filter((cardId) => cardId !== id) });
      },

      isLearned: (id) => get().learnedIds.includes(id),

      resetProgress: () => set({ learnedIds: [] }),
    }),
    {
      name: 'karuta-progress-storage', // key ที่เก็บใน AsyncStorage
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);