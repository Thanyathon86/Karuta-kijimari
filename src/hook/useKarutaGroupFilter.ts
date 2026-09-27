import { useMemo, useState } from 'react';
import { Karuta } from '../types/karuta';
import { findGroup } from '../data/kijimariGroups';

export type SortOrder = 'asc' | 'desc';

export function filterAndSortCards(
  cards: Karuta[],
  groupId: number | null,
  order: SortOrder = 'asc'
): Karuta[] {
  let result = cards;

  if (groupId !== null) {
    const group = findGroup(groupId); // กลุ่มย่อย หรือ หมวดใหญ่
    if (group) {
      result = group.cardIds
        .map((id) => cards.find((c) => c.id === id))
        .filter((c): c is Karuta => Boolean(c));
    }
  }

  return order === 'desc' ? [...result].reverse() : result;
}

export function useKarutaGroupFilter(cards: Karuta[]) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filtered = useMemo(
    () => filterAndSortCards(cards, selectedGroup, sortOrder),
    [cards, selectedGroup, sortOrder]
  );

  return { filtered, selectedGroup, setSelectedGroup, sortOrder, setSortOrder };
}