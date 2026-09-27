import { useMemo } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import TopNavbar from '../components/navigation/TopNavbar';
import GroupSelector from '../components/navigation/GroupSelector';
import KarutaCard from '../components/card/KarutaCard';
import BottomNavbar from '../components/navigation/BottomNavbar';
import { useKarutaGroupFilter } from '../hook/useKarutaGroupFilter';
import karutaData from '../data/karuta.json';
import { KarutaData } from '../types/karuta';

const ALL_CARDS = (karutaData as KarutaData).cards;

export default function Gallery() {
  const { width } = useWindowDimensions();
  const { filtered, selectedGroup, setSelectedGroup, sortOrder, setSortOrder } =
    useKarutaGroupFilter(ALL_CARDS);

  const numColumns = useMemo(() => Math.max(2, Math.floor(width / 100)), [width]);
  const gap = 12;
  const cardSize = useMemo(
    () => Math.floor((width - 32 - (numColumns - 1) * gap) / numColumns),
    [width, numColumns]
  );

  return (
    <View className="flex-1 bg-[#F1F3E0]">
      <TopNavbar
        rightSlot={
          <GroupSelector
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          />
        }
      />

      <FlatList
        key={numColumns}
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        columnWrapperStyle={{ gap, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16, gap, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <KarutaCard
            card={item}
            size={cardSize}
            onPress={() =>
              router.push(
                `/gallery/${item.id}?group=${selectedGroup ?? ''}&order=${sortOrder}` as any
              )
            }
          />
        )}
      />

      <BottomNavbar />
    </View>
  );
}