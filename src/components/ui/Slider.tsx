import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type SliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const THUMB = 34;

/** แถบเลื่อนค่าจำนวนเต็ม — แตะหรือลากตรงไหนของแถบก็ได้ */
export default function Slider({ value, min, max, onChange }: SliderProps) {
  const [width, setWidth] = useState(0);
  const ratio = (value - min) / (max - min);

  const update = (x: number) => {
    if (!width) return;
    const r = Math.min(1, Math.max(0, x / width));
    onChange(Math.round(min + r * (max - min)));
  };

  const gesture = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => update(e.x))
    .onUpdate((e) => update(e.x));

  return (
    <GestureDetector gesture={gesture}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        className="h-[26px] rounded-full bg-[#A1BC98] justify-center"
      >
        <View className="h-full rounded-full bg-[#346739]" style={{ width: `${ratio * 100}%` }} />
        <View
          className="absolute rounded-full bg-white border-2 border-[#346739]"
          style={{ width: THUMB, height: THUMB, left: ratio * (width - THUMB) }}
        />
      </View>
    </GestureDetector>
  );
}
