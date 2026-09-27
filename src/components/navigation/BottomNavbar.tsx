import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

import SettingSheet from '../settings/SettingSheet';

/**
 * Bottom Navbar แบบ reusable — ใช้ตัวเดียวจบทุกหน้า
 *
 * ปุ่มหนังสือ (กลาง) โชว์ไอคอนของหน้าที่จะไป:
 * - หนังสือปิด (journal-outline) = Flashcard → โชว์ตอนอยู่หน้า Gallery
 * - หนังสือเปิด (book-outline)    = Gallery   → โชว์ตอนอยู่หน้าอื่น (Main Menu, Flashcard)
 *
 * ปุ่มฟันเฟือง → SettingSheet สไลด์ขึ้นจากด้านล่าง (navbar ยังอยู่บนสุดตาม Figma) กดอีกครั้งเพื่อปิด
 */
export default function BottomNavbar() {
  const pathname = usePathname();
  const [settingOpen, setSettingOpen] = useState(false);

  const isHome = pathname === '/';
  const isGallery = pathname.startsWith('/gallery');
  const isFlashcard = pathname.startsWith('/flashcard');

  const bookTarget = isGallery ? '/flashcard' : '/gallery';
  const bookIconName = isGallery ? 'journal-outline' : 'book-outline';

  return (
    <>
      <SettingSheet visible={settingOpen} onClose={() => setSettingOpen(false)} />

      <View className="absolute bottom-6 left-0 right-0 items-center">
        <View className="flex-row items-center justify-between w-[86%] max-w-[345px] h-20 bg-[#D2DCB6] rounded-full px-9 shadow-lg">
          <Pressable onPress={() => router.push('/' as any)} hitSlop={12}>
            <Ionicons name="home" size={28} color={isHome ? '#000000' : '#1E1E1E'} />
          </Pressable>

          <Pressable onPress={() => router.push(bookTarget as any)} hitSlop={12}>
            <Ionicons
              name={bookIconName}
              size={28}
              color={isGallery || isFlashcard ? '#000000' : '#1E1E1E'}
            />
          </Pressable>

          <Pressable onPress={() => setSettingOpen((open) => !open)} hitSlop={12}>
            <Ionicons name="settings-outline" size={28} color="#1E1E1E" />
          </Pressable>
        </View>
      </View>
    </>
  );
}
