import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  History,
  Plus,
  Search,
  X,
} from 'lucide-react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import ShoppingItem from '../Components/ShoppingItem';
import CategoryChip from '../Components/CategoryChip';
import AddItemModal from '../Components/AddItemModal';
import ConfirmDeleteModal from '../Components/ConfirmDeleteModal';

import { useShopping } from '../context/ShoppingContext';

const statusTabs = [
  ['All', 'ALL'],
  ['Pending', 'PENDING'],
  ['Complete', 'COMPLETE'],
];

const categories = [
  ['All', '⚡'],
  ['Food', '🍔'],
  ['Drinks', '🥤'],
  ['Home', '🏠'],
  ['Personal', '🧴'],
  ['Other', '📦'],
];

const HomeScreen = ({ navigation }) => {
  const {
    items,
    stats,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
  } = useShopping();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('All');

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  // --------------------------------------------------
  // ANIMATIONS
  // --------------------------------------------------

  const headerAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const fabScale = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    // Header animation
    Animated.spring(headerAnimation, {
      toValue: 1,
      friction: 7,
      tension: 55,
      useNativeDriver: true,
    }).start();

    // FAB pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.timing(fabScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, []);

  // --------------------------------------------------
  // FILTER ITEMS
  // --------------------------------------------------

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === 'ALL' ||
        (status === 'PENDING' &&
          !item.purchased) ||
        (status === 'COMPLETE' &&
          item.purchased);

      const matchesCategory =
        category === 'All' ||
        item.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    items,
    search,
    status,
    category,
  ]);

  // --------------------------------------------------
  // ADD ITEM
  // --------------------------------------------------

  const openAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  // --------------------------------------------------
  // EDIT ITEM
  // --------------------------------------------------

  const openEdit = (item) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  // --------------------------------------------------
  // SAVE ITEM
  // --------------------------------------------------

  const handleSave = (data) => {
    if (editingItem) {
      updateItem(
        editingItem.id,
        data
      );
    } else {
      addItem(data);
    }

    setEditingItem(null);
    setModalVisible(false);
  };

  // --------------------------------------------------
  // DELETE ITEM
  // --------------------------------------------------

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem(deleteTarget.id);

    setDeleteTarget(null);
  };

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  const renderHeader = () => (
    <>
      {/* --------------------------------------------
          HEADER
      -------------------------------------------- */}

      <Animated.View
        className="flex-row justify-between items-start mb-[22px]"
        style={{
          opacity: headerAnimation,

          transform: [
            {
              translateY:
                headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
            },
          ],
        }}
      >
        {/* TITLE */}

        <View>
          <Text className="text-[#B6FF00] text-[11px] font-black tracking-[2px] mb-[8px]">
            SHOPLIST ⚡
          </Text>

          <Text className="text-white text-[32px] font-black leading-[31px]">
            GET IT.
          </Text>

          <Text className="text-[#B6FF00] text-[32px] font-black leading-[34px]">
            CHECK IT.
          </Text>
        </View>

        {/* HISTORY */}

        <Pressable
          onPress={() =>
            navigation.navigate('History')
          }
          className="flex-row items-center gap-[7px] px-[12px] h-[42px] rounded-[14px] bg-[#171717] border border-[#303030]"
        >
          <History
            size={19}
            color="#B6FF00"
          />

          <Text className="text-[#B6FF00] text-[9px] font-black tracking-[0.8px]">
            HISTORY
          </Text>
        </Pressable>
      </Animated.View>

      {/* --------------------------------------------
          STATS CARD
      -------------------------------------------- */}

      <LinearGradient
        colors={[
          '#202900',
          '#171717',
        ]}
        className="rounded-[26px] p-[19px] mb-[14px] border border-[#303800]"
      >
        {/* STATS TOP */}

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-[#778000] text-[9px] font-black tracking-[1.5px]">
              THIS SHOPPING RUN
            </Text>

            <Text className="text-white text-[29px] font-black mt-[5px]">
              $
              {stats.totalAmount.toFixed(
                2
              )}
            </Text>
          </View>

          {/* ITEMS LEFT */}

          <View className="items-center justify-center w-[55px] h-[55px] rounded-[18px] bg-[#B6FF00]">
            <Text className="text-[#080808] text-[19px] font-black">
              {stats.pendingItems}
            </Text>

            <Text className="text-[#080808] text-[7px] font-black">
              LEFT
            </Text>
          </View>
        </View>

        {/* PROGRESS */}

        <View className="h-[7px] rounded-[20px] bg-[#333900] overflow-hidden mt-[17px]">
          <View
            className="h-full rounded-[20px] bg-[#B6FF00]"
            style={{
              width: `${
                Math.max(
                  stats.progress * 100,
                  stats.totalItems
                    ? 5
                    : 0
                )
              }%`,
            }}
          />
        </View>

        {/* STATS BOTTOM */}

        <View className="flex-row justify-between mt-[8px]">
          <Text className="text-[#727272] text-[10px]">
            {stats.purchasedItems} of{' '}
            {stats.totalItems} purchased
          </Text>

          <Text className="text-[#B6FF00] text-[10px] font-black">
            {Math.round(
              stats.progress * 100
            )}
            %
          </Text>
        </View>
      </LinearGradient>

      {/* --------------------------------------------
          SEARCH
      -------------------------------------------- */}

      <View className="h-[55px] rounded-[18px] bg-[#151515] border border-[#272727] flex-row items-center px-[15px] mb-[12px] gap-[9px]">
        <Search
          size={21}
          color="#B6FF00"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search your stuff..."
          placeholderTextColor="#555555"
          className="flex-1 text-white text-[14px] font-semibold"
        />

        {search.length > 0 && (
          <Pressable
            onPress={() =>
              setSearch('')
            }
          >
            <X
              size={19}
              color="#777777"
            />
          </Pressable>
        )}
      </View>

      {/* --------------------------------------------
          STATUS TABS
      -------------------------------------------- */}

      <View className="flex-row gap-[8px] mb-[13px]">
        {statusTabs.map(
          ([label, value]) => (
            <Pressable
              key={value}
              onPress={() =>
                setStatus(value)
              }
              className={`flex-1 h-[48px] rounded-[15px] flex-row items-center justify-center gap-[6px] border ${
                status === value
                  ? 'bg-[#B6FF00] border-[#B6FF00]'
                  : 'bg-[#151515] border-[#292929]'
              }`}
            >
              <Text
                className={`text-[11px] font-black ${
                  status === value
                    ? 'text-[#080808]'
                    : 'text-[#777777]'
                }`}
              >
                {label}
              </Text>

              <Text
                className={`text-[10px] font-extrabold ${
                  status === value
                    ? 'text-[#273000]'
                    : 'text-[#555555]'
                }`}
              >
                {value === 'ALL'
                  ? stats.totalItems
                  : value === 'PENDING'
                  ? stats.pendingItems
                  : stats.purchasedItems}
              </Text>
            </Pressable>
          )
        )}
      </View>

      {/* --------------------------------------------
          CATEGORY FILTER
      -------------------------------------------- */}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        data={categories}
        keyExtractor={(item) =>
          item[0]
        }
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <CategoryChip
            title={item[0]}
            icon={item[1]}
            active={
              category === item[0]
            }
            onPress={() =>
              setCategory(item[0])
            }
          />
        )}
      />

      {/* --------------------------------------------
          LIST HEADER
      -------------------------------------------- */}

      <View className="mb-[12px]">
        <Text className="text-white text-[13px] font-black tracking-[1.5px]">
          {status === 'ALL'
            ? 'YOUR LIST'
            : status === 'PENDING'
            ? 'PENDING'
            : 'COMPLETED'}
        </Text>

        <Text className="text-[#555555] text-[10px] mt-[3px]">
          {filteredItems.length}{' '}
          {filteredItems.length === 1
            ? 'item'
            : 'items'}
        </Text>
      </View>
    </>
  );

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <SafeAreaView className="flex-1 bg-[#080808]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080808"
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <ShoppingItem
            item={item}
            onToggle={togglePurchased}
            onDelete={setDeleteTarget}
            onEdit={openEdit}
          />
        )}
        ListHeaderComponent={
          renderHeader
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 110,
        }}
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View className="items-center pt-[55px]">
            <Text className="text-[48px] mb-[12px]">
              🛒
            </Text>

            <Text className="text-white text-[19px] font-black">
              Nothing here yet
            </Text>

            <Text className="text-[#5C5C5C] text-[12px] mt-[6px]">
              Add something and build your list.
            </Text>
          </View>
        }
      />

      {/* --------------------------------------------
          FLOATING ACTION BUTTON
      -------------------------------------------- */}

      <Animated.View
        className="absolute right-[22px] bottom-[25px]"
        style={{
          transform: [
            {
              scale: fabScale,
            },
          ],
        }}
      >
        <Pressable
          onPress={openAdd}
          className="w-[65px] h-[65px] rounded-[23px] bg-[#B6FF00] items-center justify-center"
          style={{
            elevation: 10,
          }}
        >
          <Plus
            size={34}
            color="#080808"
            strokeWidth={2.5}
          />
        </Pressable>
      </Animated.View>

      {/* --------------------------------------------
          ADD / EDIT MODAL
      -------------------------------------------- */}

      <AddItemModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editingItem={editingItem}
      />

      {/* --------------------------------------------
          DELETE CONFIRMATION
      -------------------------------------------- */}

      <ConfirmDeleteModal
        visible={!!deleteTarget}
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;