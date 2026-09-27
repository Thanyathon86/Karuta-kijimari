import { useMemo, useState } from 'react';
import { Karuta } from '../types/karuta';

export type SortMode = 'asc' | 'desc' | 'syllable';

export function useKarutaSort(cards: Karuta[]) {
  const [sortMode, setSortMode] = useState<SortMode>('asc');

  const sorted = useMemo(() => {
    const copy = [...cards];
    switch (sortMode) {
      case 'desc':
        return copy.sort((a, b) => b.id - a.id);
      case 'syllable':
        // เรียงตามความยาวคำ kijimari (ใกล้เคียงจำนวนพยางค์มากสุดที่ทำได้จากข้อมูลที่มี)
        return copy.sort((a, b) => a.kijimari.length - b.kijimari.length);
      case 'asc':
      default:
        return copy.sort((a, b) => a.id - b.id);
    }
  }, [cards, sortMode]);

  return { sorted, sortMode, setSortMode };
}