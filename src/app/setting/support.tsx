import { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import TopNavbar from '../../components/navigation/TopNavbar';

const ACCOUNT_NUMBER = '155-1-52843-6';

export default function SupportSetting() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(ACCOUNT_NUMBER);
    setCopied(true);
  };

  return (
    <View className="flex-1 bg-[#D2DCB6]">
      <TopNavbar title="สนับสนุน" />

      <View className="items-center px-5 pt-16">
        <Text className="text-black text-2xl text-center">สนับสนุนค่าเข้าซ้อมคารุตะให้น้องต้นน้ำ</Text>

        {/* QR สำหรับโอนเงิน */}
        <View className="w-[254px] max-w-full aspect-square bg-[#A1BC98] rounded-[15px] items-center justify-center mt-14 p-3">
          <Image
            source={require('../../../assets/images/qr.jpg')}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
            resizeMode="contain"
          />
        </View>

        {/* w-full + textBreakStrategy="simple" กันบั๊ก Android ตัดข้อความภาษาไทยขาดท้ายบรรทัด
            adjustsFontSizeToFit ย่อฟอนต์ให้อยู่บรรทัดเดียวบนจอแคบ */}
        <Text
          className="text-black text-2xl text-center w-full mt-5"
          textBreakStrategy="simple"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ธนาคาร : กสิกร
        </Text>
        <Text
          className="text-black text-2xl text-center w-full"
          textBreakStrategy="simple"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          ชื่อบัญชี : ธัญญธร วงษ์จันทร์
        </Text>

        <Pressable
          onPress={copy}
          className="flex-row items-center justify-center gap-3 w-[254px] h-[30px] bg-[#A1BC98] rounded-[15px] mt-2 active:opacity-60"
        >
          <Text className="text-black text-xl">{ACCOUNT_NUMBER}</Text>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color="#1E1E1E" />
        </Pressable>
        {copied && <Text className="text-black text-sm mt-1">คัดลอกเลขบัญชีแล้ว</Text>}
      </View>
    </View>
  );
}
