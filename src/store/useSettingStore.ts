import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

export type Language = 'th' | 'en' | 'ja';

interface SettingsState {
  language: Language;
  /** ระดับเสียง 1-10 ตาม slider ใน Figma */
  soundVolume: number;

  setLanguage: (lang: Language) => void;
  setSoundVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'th',
      soundVolume: 5,

      setLanguage: (language) => set({ language }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
    }),
    {
      name: 'karuta-settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);