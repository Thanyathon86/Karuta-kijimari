import { Redirect } from 'expo-router';

// เมนูตั้งค่าอยู่ใน SettingSheet (เปิดจากปุ่มฟันเฟือง) — ถ้าเข้า /setting ตรงๆ ให้กลับหน้าแรก
export default function SettingIndex() {
  return <Redirect href="/" />;
}
