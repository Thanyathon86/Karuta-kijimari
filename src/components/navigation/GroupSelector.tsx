import { View, Text, Pressable, Modal, SectionList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KIJIMARI_GROUPS, KIJIMARI_CATEGORIES, categoryTitle, findGroup } from '../../data/kijimariGroups';
import { SortOrder } from '../../hook/useKarutaGroupFilter';

export type MemoryFilter = 'all' | 'learned' | 'unlearned';

type GroupSelectorProps = {
  selectedGroup: number | null;
  onSelectGroup: (groupId: number | null) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  /** ส่งมาเมื่ออยากให้กรอง "จำได้/จำไม่ได้" ด้วย (หน้า Learning) — ไม่ส่งก็ไม่แสดง */
  memoryFilter?: MemoryFilter;
  onChangeMemoryFilter?: (filter: MemoryFilter) => void;
};

const MEMORY_OPTIONS: { value: MemoryFilter; label: string; short: string }[] = [
  { value: 'all', label: 'ทั้งหมด', short: '' },
  { value: 'unlearned', label: 'ยังจำไม่ได้', short: 'ยังไม่จำ' },
  { value: 'learned', label: 'จำได้แล้ว', short: 'จำแล้ว' },
];

// แต่ละหมวด = หัวข้อใหญ่ (กดเอาทั้งหมวดได้ ถ้ามีหลายกลุ่มย่อย) + กลุ่มย่อยข้างใน
const SECTIONS = Array.from(new Set(KIJIMARI_GROUPS.map((g) => g.charCount)))
  .sort((a, b) => a - b)
  .map((count) => ({
    title: categoryTitle(count),
    category: KIJIMARI_CATEGORIES.find((c) => c.charCount === count),
    data: KIJIMARI_GROUPS.filter((g) => g.charCount === count),
  }));

export default function GroupSelector({
  selectedGroup,
  onSelectGroup,
  sortOrder,
  onToggleSortOrder,
  memoryFilter,
  onChangeMemoryFilter,
}: GroupSelectorProps) {
  const [open, setOpen] = useState(false);

  const currentLabel =
    selectedGroup === null
      ? sortOrder === 'asc'
        ? '1→100'
        : '100→1'
      : findGroup(selectedGroup)?.label ?? 'All';
  const groupLabel = currentLabel.length > 9 ? currentLabel.slice(0, 8) + '…' : currentLabel;
  const memoryLabel = MEMORY_OPTIONS.find((m) => m.value === memoryFilter)?.short;
  const shortLabel = memoryLabel ? `${groupLabel} · ${memoryLabel}` : groupLabel;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 px-4 bg-[#D2DCB6] rounded-2xl items-center justify-center"
      >
        <Text className="text-black text-sm">{shortLabel}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 bg-black/40 justify-center px-8"
          onPress={() => setOpen(false)}
        >
          <Pressable onPress={() => {}} className="bg-[#F1F3E0] rounded-2xl p-4 max-h-[75%]">
            <Text className="text-black text-lg font-bold mb-3 text-center">
              เลือกกลุ่มไพ่ (決まり字)
            </Text>

            {/* แถว All - รวมปุ่มสลับ order ไว้ในแถวเดียวกัน */}
            <View
              className={`flex-row items-center justify-between py-3 px-3 rounded-xl mb-3 ${
                selectedGroup === null ? 'bg-[#346739]' : 'bg-[#D2DCB6]'
              }`}
            >
              <Pressable
                onPress={() => {
                  onSelectGroup(null);
                  setOpen(false);
                }}
                className="flex-1"
              >
                <Text className={selectedGroup === null ? 'text-white' : 'text-black'}>
                  All — ทั้งหมด
                </Text>
              </Pressable>

              <Pressable
                onPress={onToggleSortOrder}
                className="flex-row items-center gap-1 ml-2 bg-black/10 rounded-lg px-2 py-1"
                hitSlop={8}
              >
                <Text className={selectedGroup === null ? 'text-white' : 'text-black'}>
                  {sortOrder === 'asc' ? '1→100' : '100→1'}
                </Text>
                <Ionicons
                  name="swap-vertical"
                  size={14}
                  color={selectedGroup === null ? '#FFFFFF' : '#000000'}
                />
              </Pressable>
            </View>

            {/* กรองตามการจำ (เฉพาะหน้าที่ส่ง memoryFilter มา) */}
            {memoryFilter && onChangeMemoryFilter && (
              <View className="flex-row gap-2 mb-3">
                {MEMORY_OPTIONS.map((m) => {
                  const active = m.value === memoryFilter;
                  return (
                    <Pressable
                      key={m.value}
                      onPress={() => onChangeMemoryFilter(m.value)}
                      className={`flex-1 py-2 rounded-xl items-center ${active ? 'bg-[#346739]' : 'bg-[#D2DCB6]'}`}
                    >
                      <Text className={active ? 'text-white' : 'text-black'}>{m.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <SectionList
              sections={SECTIONS}
              keyExtractor={(item) => String(item.id)}
              renderSectionHeader={({ section }) => {
                const { category } = section;
                if (!category) {
                  return (
                    <Text className="text-black font-bold mt-2 mb-1 text-sm opacity-60">{section.title}</Text>
                  );
                }
                // หัวข้อใหญ่ที่กดได้ → เอาไพ่ทุกใบในหมวดนี้
                const isSelected = category.id === selectedGroup;
                return (
                  <Pressable
                    onPress={() => {
                      onSelectGroup(category.id);
                      setOpen(false);
                    }}
                    className={`flex-row items-center justify-between mt-3 mb-1 py-2 px-3 rounded-xl ${
                      isSelected ? 'bg-[#346739]' : 'bg-[#D2DCB6]'
                    }`}
                  >
                    <Text className={`font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{section.title}</Text>
                    <Text className={`text-sm ${isSelected ? 'text-white' : 'text-black/60'}`}>
                      {category.description}
                    </Text>
                  </Pressable>
                );
              }}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedGroup;
                return (
                  <Pressable
                    onPress={() => {
                      onSelectGroup(item.id);
                      setOpen(false);
                    }}
                    className={`py-3 pl-6 pr-3 rounded-xl mb-1 ${
                      isSelected ? 'bg-[#346739]' : 'bg-transparent'
                    }`}
                  >
                    <Text className={isSelected ? 'text-white' : 'text-black'}>
                      {item.label} — {item.description}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}