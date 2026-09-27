import { View } from 'react-native';

import TopNavbar from '../../components/navigation/TopNavbar';
import PillButton from '../../components/ui/PillButton';
import { Language, useSettingsStore } from '../../store/useSettingStore';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
];

export default function LanguageSetting() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <View className="flex-1 bg-[#D2DCB6]">
      <TopNavbar title="ภาษา" />

      {/* 2 คอลัมน์ตาม Figma — ภาษาที่เลือกอยู่เป็นปุ่มทึบ */}
      <View className="flex-row flex-wrap justify-between gap-y-7 px-5 pt-12">
        {LANGUAGES.map((lang) => (
          <PillButton
            key={lang.code}
            label={lang.label}
            onPress={() => setLanguage(lang.code)}
            variant={language === lang.code ? 'solid' : 'outline'}
            className="w-[47%]"
          />
        ))}
      </View>
    </View>
  );
}
