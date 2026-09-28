import React, { useMemo, useState } from 'react';

import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  List,
} from 'lucide-react-native';

import { useShopping } from '../context/ShoppingContext';

const HistoryScreen = ({ navigation }) => {
  const {
    deletedItems,
    lists,
    restoreMany,
    permanentlyDeleteMany,
  } = useShopping();

  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});

  // --------------------------------------------------
  // GROUP DELETED ITEMS BY LIST
  // --------------------------------------------------

  const groupedLists = useMemo(() => {
    const groups = {};

    deletedItems.forEach((item) => {
      const listId = item.listId || 'unknown';

      if (!groups[listId]) {
        const list = lists.find(
          (currentList) => currentList.id === listId
        );

        groups[listId] = {
          id: listId,
          name: list?.name || 'Unknown List',
          items: [],
        };
      }

      groups[listId].items.push(item);
    });

    return Object.values(groups);
  }, [deletedItems, lists]);

  // --------------------------------------------------
  // TOTAL DELETED ITEMS
  // --------------------------------------------------

  const totalDeletedItems = deletedItems.length;

  // --------------------------------------------------
  // TOGGLE ITEM
  // --------------------------------------------------

  const toggleItemSelection = (itemId) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // --------------------------------------------------
  // TOGGLE WHOLE LIST
  // --------------------------------------------------

  const toggleListSelection = (listItems) => {
    const ids = listItems.map((item) => item.id);

    const allSelected = ids.every((id) =>
      selectedIds.includes(id)
    );

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !ids.includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...ids]),
      ]);
    }
  };

  // --------------------------------------------------
  // EXPAND / COLLAPSE LIST
  // --------------------------------------------------

  const toggleListExpanded = (listId) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // --------------------------------------------------
  // RESTORE SELECTED
  // --------------------------------------------------

  const restoreSelected = () => {
    if (!selectedIds.length) return;

    restoreMany(selectedIds);
    setSelectedIds([]);
  };

  // --------------------------------------------------
  // PERMANENT DELETE SELECTED
  // --------------------------------------------------

  const permanentlyDeleteSelected = () => {
    if (!selectedIds.length) return;

    permanentlyDeleteMany(selectedIds);
    setSelectedIds([]);
  };

  // --------------------------------------------------
  // CATEGORY ICON
  // --------------------------------------------------

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food':
        return '🍔';

      case 'Drinks':
        return '🥤';

      case 'Home':
        return '🏠';

      case 'Personal':
        return '🧴';

      case 'Gaming':
        return '🎮';

      default:
        return '📦';
    }
  };

  // --------------------------------------------------
  // LIST CARD
  // --------------------------------------------------

  const renderList = ({ item: listGroup }) => {
    const isExpanded =
      expandedLists[listGroup.id] !== false;

    const listItemIds = listGroup.items.map(
      (item) => item.id
    );

    const selectedCount = listItemIds.filter((id) =>
      selectedIds.includes(id)
    ).length;

    const allListSelected =
      listGroup.items.length > 0 &&
      selectedCount === listGroup.items.length;

    const listTotal = listGroup.items.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

    return (
      <View className="mb-[15px] rounded-[24px] bg-[#111111] border border-[#292929] overflow-hidden">

        {/* ==========================================
            LIST HEADER
        ========================================== */}

        <View className="px-[15px] py-[15px]">

          <View className="flex-row items-center">

            {/* LIST ICON */}

            <View className="w-[48px] h-[48px] rounded-[16px] bg-[#1D2510] border border-[#344414] items-center justify-center mr-[12px]">
              <List
                size={22}
                color="#B6FF00"
              />
            </View>

            {/* LIST NAME */}

            <View className="flex-1">

              <Text
                numberOfLines={1}
                className="text-white text-[16px] font-black"
              >
                {listGroup.name}
              </Text>

              <Text className="text-[#666666] text-[10px] mt-[4px]">
                {listGroup.items.length}{' '}
                deleted{' '}
                {listGroup.items.length === 1
                  ? 'item'
                  : 'items'}
              </Text>

            </View>

            {/* TOTAL */}

            <View className="items-end">

              <Text className="text-[#B6FF00] text-[13px] font-black">
                ${listTotal.toFixed(2)}
              </Text>

              <Text className="text-[#555555] text-[8px] mt-[3px]">
                DELETED VALUE
              </Text>

            </View>

          </View>

          {/* LIST ACTIONS */}

          <View className="flex-row items-center mt-[14px]">

            {/* SELECT WHOLE LIST */}

            <Pressable
              onPress={() =>
                toggleListSelection(
                  listGroup.items
                )
              }
              className={`flex-1 pl-3 h-[40px] rounded-[12px] border flex-row items-center justify-start gap-[7px] ${
                allListSelected
                  ? 'bg-[#B6FF00] border-[#B6FF00]'
                  : 'bg-[#191919] border-[#303030]'
              }`}
            >
              <View
                className={`w-[18px] h-[18px] rounded-[5px] border items-center justify-center ${
                  allListSelected
                    ? 'bg-[#080808] border-[#080808]'
                    : 'border-[#555555]'
                }`}
              >
                {allListSelected && (
                  <Check
                    size={12}
                    color="#B6FF00"
                    strokeWidth={3}
                  />
                )}
              </View>

              <Text
                className={`text-[9px] font-black ${
                  allListSelected
                    ? 'text-[#080808]'
                    : 'text-[#AAAAAA]'
                }`}
              >
                {allListSelected
                  ? 'LIST SELECTED'
                  : 'SELECT LIST'}
              </Text>
            </Pressable>

            {/* EXPAND */}

            <Pressable
              onPress={() =>
                toggleListExpanded(
                  listGroup.id
                )
              }
              className="w-[40px] h-[40px] ml-[8px] rounded-[12px] bg-[#191919] border border-[#303030] items-center justify-center"
            >
              {isExpanded ? (
                <ChevronUp
                  size={18}
                  color="#B6FF00"
                />
              ) : (
                <ChevronDown
                  size={18}
                  color="#B6FF00"
                />
              )}
            </Pressable>

          </View>

        </View>

        {/* ==========================================
            DELETED ITEMS
        ========================================== */}

        {isExpanded && (
          <View className="px-[15px] pb-[5px]">

            {listGroup.items.map((item) => {
              const selected =
                selectedIds.includes(item.id);

              const total =
                Number(item.price || 0) *
                Number(item.quantity || 0);

              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    toggleItemSelection(
                      item.id
                    )
                  }
                  className={`min-h-[68px] rounded-[17px] mb-[9px] px-[10px] flex-row items-center border ${
                    selected
                      ? 'bg-[#171D08] border-[#B6FF00]'
                      : 'bg-[#181818] border-[#292929]'
                  }`}
                >

                  {/* CHECKBOX */}

                  <View
                    className={`w-[22px] h-[22px] rounded-[7px] border-[1.5px] items-center justify-center mr-[9px] ${
                      selected
                        ? 'bg-[#B6FF00] border-[#B6FF00]'
                        : 'border-[#444444]'
                    }`}
                  >
                    {selected && (
                      <Check
                        size={14}
                        color="#080808"
                        strokeWidth={3}
                      />
                    )}
                  </View>

                  {/* CATEGORY */}

                  <View className="w-[40px] h-[40px] rounded-[13px] bg-[#222222] items-center justify-center mr-[10px]">
                    <Text className="text-[18px]">
                      {getCategoryIcon(
                        item.category
                      )}
                    </Text>
                  </View>

                  {/* ITEM INFO */}

                  <View className="flex-1">

                    <Text
                      numberOfLines={1}
                      className="text-white text-[13px] font-black"
                    >
                      {item.name}
                    </Text>

                    <Text className="text-[#626262] text-[9px] mt-[4px]">
                      {item.quantity} × $
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                    </Text>

                  </View>

                  {/* ITEM TOTAL */}

                  <Text className="text-[#888888] text-[11px] font-black">
                    ${total.toFixed(2)}
                  </Text>

                </Pressable>
              );
            })}

          </View>
        )}

      </View>
    );
  };

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (!deletedItems.length) {
    return (
      <SafeAreaView className="flex-1 bg-[#080808]">

        <StatusBar
          barStyle="light-content"
          backgroundColor="#080808"
        />

        <View className="h-[82px] px-[18px] flex-row items-center border-b border-[#191919]">

          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            className="w-[42px] h-[42px] rounded-[14px] bg-[#171717] items-center justify-center"
          >
            <ArrowLeft
              size={21}
              color="#FFFFFF"
            />
          </Pressable>

          <View className="flex-1">

            <Text className="text-white text-center text-[19px] font-black tracking-[1.5px]">
              HISTORY
            </Text>

            <Text className="text-[#5E5E5E] text-center text-[10px] mt-[3px]">
              Deleted shopping lists
            </Text>

          </View>

          <View className="w-[42px]" />

        </View>

        <View className="flex-1 items-center justify-center">

          <Text className="text-[52px] mb-[15px]">
            🗑️
          </Text>

          <Text className="text-white text-[18px] font-black">
            HISTORY IS EMPTY
          </Text>

          <Text className="text-[#555555] text-[11px] mt-[7px]">
            Deleted items will appear here.
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // MAIN
  // --------------------------------------------------

  return (
    <SafeAreaView className="flex-1 bg-[#080808]">

      <StatusBar
        barStyle="light-content"
        backgroundColor="#080808"
      />

      {/* ============================================
          HEADER
      ============================================ */}

      <View className="h-[82px] px-[18px] flex-row items-center justify-between border-b border-[#191919]">

        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          className="w-[42px] h-[42px] rounded-[14px] bg-[#171717] items-center justify-center"
        >
          <ArrowLeft
            size={21}
            color="#FFFFFF"
          />
        </Pressable>

        <View>

          <Text className="text-white text-center text-[19px] font-black tracking-[1.5px]">
            HISTORY
          </Text>

          <Text className="text-[#5E5E5E] text-center text-[10px] mt-[3px]">
            Deleted shopping lists
          </Text>

        </View>

        <View className="items-end">

          <Text className="text-[#B6FF00] text-[17px] font-black">
            {totalDeletedItems}
          </Text>

          <Text className="text-[#555555] text-[7px] font-black tracking-[1px]">
            ITEMS
          </Text>

        </View>

      </View>

      {/* ============================================
          LIST
      ============================================ */}

      <FlatList
        data={groupedLists}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderList}
        contentContainerStyle={{
          padding: 16,
          paddingBottom:
            selectedIds.length > 0
              ? 115
              : 25,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* ============================================
          GLOBAL ACTION BAR
      ============================================ */}

      {selectedIds.length > 0 && (
        <View className="absolute left-[15px] right-[15px] bottom-[18px] h-[72px] rounded-[22px] bg-[#191919] border border-[#343434] px-[15px] flex-row items-center justify-between">

          {/* SELECTED */}

          <View>

            <Text className="text-[#B6FF00] text-[19px] font-black">
              {selectedIds.length}
            </Text>

            <Text className="text-[#666666] text-[7px] font-black tracking-[1px]">
              SELECTED
            </Text>

          </View>

          {/* ACTIONS */}

          <View className="flex-row gap-[9px]">

            {/* RESTORE */}

            <Pressable
              onPress={restoreSelected}
              className="h-[44px] px-[15px] rounded-[14px] bg-[#B6FF00] flex-row items-center gap-[7px]"
            >
              <RotateCcw
                size={17}
                color="#080808"
              />

              <Text className="text-[#080808] text-[10px] font-black">
                RESTORE
              </Text>
            </Pressable>

            {/* DELETE */}

            <Pressable
              onPress={
                permanentlyDeleteSelected
              }
              className="w-[44px] h-[44px] rounded-[14px] bg-[#291717] border border-[#4C2828] items-center justify-center"
            >
              <Trash2
                size={17}
                color="#FF5A5A"
              />
            </Pressable>

          </View>

        </View>
      )}

    </SafeAreaView>
  );
};

export default HistoryScreen;