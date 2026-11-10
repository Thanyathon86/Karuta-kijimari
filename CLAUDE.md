@AGENTS.md

## Project

แอป Karuta (Expo SDK 57 + expo-router, React Native 0.86, NativeWind/Tailwind, Zustand)
- โค้ดหลักอยู่ใน `src/` (`app`, `components`, `data`, `hook`, `store`, `types`, `utils`)
- Repo: https://github.com/Thanyathon86/Karuta-kijimari (remote `origin`, branch หลัก `master`)
- Scripts: `npm start`, `npm run android`, `npm run ios`, `npm run web`, `npm run lint`, `npm run deploy:web`

## Workflow (ทำตามลำดับนี้ทุกงานที่แก้โค้ด)

1. **อ่าน project ก่อน**: อ่านไฟล์ที่เกี่ยวข้องจริง อย่าเดาจากชื่อไฟล์หรือจาก CLAUDE.md อย่างเดียว
2. **อธิบายโครงสร้าง**: สรุปสั้น ๆ ว่าส่วนที่จะแตะอยู่ตรงไหน ทำงานอย่างไร
3. **วางแผนก่อนแก้**: บอกไฟล์ที่จะสร้าง/แก้, schema/storage ที่จะเปลี่ยน (เช่น shape ของ Zustand store / AsyncStorage), package ที่จะติดตั้ง แล้ว**รอผู้ใช้ยืนยันก่อนลงมือ**
4. **แก้ทีละส่วน**: แบ่งงานเป็นชิ้นเล็ก ทำให้แต่ละชิ้นเสร็จและรันได้ก่อนไปชิ้นถัดไป
5. **รัน typecheck/lint/test**: อย่างน้อย `npx tsc --noEmit` และ `npm run lint` ถ้ามี test ให้รันด้วย ถ้าติดตั้ง package ใหม่ให้ใช้ `npx expo install` เพื่อให้ได้เวอร์ชันที่เข้ากับ SDK ถ้าไม่ผ่านให้แก้หรือรายงานผลตามจริง
6. **สรุป diff**: บอกว่าแก้ไฟล์อะไร เปลี่ยนอะไร เพราะอะไร และสิ่งที่ยังไม่ได้ทำหรือยังไม่ได้ทดสอบ
7. **ช่วย commit**: เสนอ commit message (ภาษาอังกฤษ, รูปแบบ `type: summary` เช่น `feat: add card deck screen`) แล้ว**ถามก่อน commit** ห้าม push ถ้าไม่ได้สั่ง เช็กว่าไม่มี `.env*`, `dist/`, `.expo/`, `ios/` หรือ `android/` ติดไปด้วย
