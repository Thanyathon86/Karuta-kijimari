import { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { chants } from '../data/chants';
import { useSettingsStore } from '../store/useSettingStore';

/** เล่นเสียงอ่านกลอนของไพ่: ท่อนต้นจบแล้วต่อท่อนปลายอัตโนมัติ, ความดังตามหน้าตั้งค่า (1-10) */
export function usePlayChant(cardId?: number) {
  const [first, second] = (cardId && chants[cardId]) || [null, null];
  const volume = useSettingsStore((s) => s.soundVolume) / 10;

  const firstPlayer = useAudioPlayer(first);
  const secondPlayer = useAudioPlayer(second);
  const firstStatus = useAudioPlayerStatus(firstPlayer);
  const secondStatus = useAudioPlayerStatus(secondPlayer);

  useEffect(() => {
    firstPlayer.volume = volume;
    secondPlayer.volume = volume;
  }, [volume, firstPlayer, secondPlayer]);

  // ท่อนต้นจบ → เล่นท่อนปลายต่อ
  useEffect(() => {
    if (!firstStatus.didJustFinish) return;
    secondPlayer.seekTo(0);
    secondPlayer.play();
  }, [firstStatus.didJustFinish, secondPlayer]);

  const stop = () => {
    firstPlayer.pause();
    secondPlayer.pause();
  };

  const play = () => {
    stop();
    firstPlayer.seekTo(0);
    firstPlayer.play();
  };

  const playing = firstStatus.playing || secondStatus.playing;
  return { playing, toggle: playing ? stop : play };
}
