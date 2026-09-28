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
  StyleSheet,
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
  const [category, setCategory] =
    useState('All');

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const headerAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const fabScale = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.spring(headerAnimation, {
      toValue: 1,
      friction: 7,
      tension: 55,
      useNativeDriver: true,
    }).start();

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

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

  const openAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalVisible(true);
  };

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

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteItem(deleteTarget.id);
    setDeleteTarget(null);
  };

  const renderHeader = () => (
    <>
      <Animated.View
        style={[
          styles.header,
          {
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
          },
        ]}
      >
        <View className=''>
          <Text style={styles.miniTitle}>
            SHOPLIST ⚡
          </Text>

          <Text style={styles.heading}>
            GET IT.
          </Text>

          <Text style={styles.headingAccent}>
            CHECK IT.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('History')
          }
          style={styles.historyButton}
        >
          <History
            size={19}
            color="#B6FF00"
          />

          <Text style={styles.historyText}>
            HISTORY
          </Text>
        </Pressable>
      </Animated.View>

      {/* STATS */}
      <LinearGradient
        colors={['#202900', '#171717']}
        style={styles.statsCard}
      >
        <View style={styles.statsTop}>
          <View>
            <Text style={styles.statsLabel}>
              THIS SHOPPING RUN
            </Text>

            <Text style={styles.statsAmount}>
              $
              {stats.totalAmount.toFixed(
                2
              )}
            </Text>
          </View>

          <View style={styles.itemsBubble}>
            <Text style={styles.itemsNumber}>
              {stats.pendingItems}
            </Text>

            <Text style={styles.itemsLabel}>
              LEFT
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  Math.max(
                    stats.progress * 100,
                    stats.totalItems
                      ? 5
                      : 0
                  )
                }%`,
              },
            ]}
          />
        </View>

        <View style={styles.statsBottom}>
          <Text style={styles.progressText}>
            {stats.purchasedItems} of{' '}
            {stats.totalItems} purchased
          </Text>

          <Text style={styles.percent}>
            {Math.round(
              stats.progress * 100
            )}
            %
          </Text>
        </View>
      </LinearGradient>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Search
          size={21}
          color="#B6FF00"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search your stuff..."
          placeholderTextColor="#555555"
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch('')}
          >
            <X
              size={19}
              color="#777777"
            />
          </Pressable>
        )}
      </View>

      {/* STATUS TABS */}
      <View style={styles.statusTabs}>
        {statusTabs.map(([label, value]) => (
          <Pressable
            key={value}
            onPress={() => setStatus(value)}
            style={[
              styles.statusTab,
              status === value &&
                styles.activeStatusTab,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                status === value &&
                  styles.activeStatusText,
              ]}
            >
              {label}
            </Text>

            <Text
              style={[
                styles.statusCount,
                status === value &&
                  styles.activeStatusCount,
              ]}
            >
              {value === 'ALL'
                ? stats.totalItems
                : value === 'PENDING'
                ? stats.pendingItems
                : stats.purchasedItems}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* CATEGORY FILTER */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={
          styles.categoryList
        }
        renderItem={({ item }) => (
          <CategoryChip
            title={item[0]}
            icon={item[1]}
            active={category === item[0]}
            onPress={() =>
              setCategory(item[0])
            }
          />
        )}
      />

      <View style={styles.listHeader}>
        <View>
          <Text style={styles.listTitle}>
            {status === 'ALL'
              ? 'YOUR LIST'
              : status === 'PENDING'
              ? 'PENDING'
              : 'COMPLETED'}
          </Text>

          <Text style={styles.listSubtitle}>
            {filteredItems.length}{' '}
            {filteredItems.length === 1
              ? 'item'
              : 'items'}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080808"
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShoppingItem
            item={item}
            onToggle={togglePurchased}
            onDelete={setDeleteTarget}
            onEdit={openEdit}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              🛒
            </Text>

            <Text style={styles.emptyTitle}>
              Nothing here yet
            </Text>

            <Text style={styles.emptyText}>
              Add something and build your list.
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [
              { scale: fabScale },
            ],
          },
        ]}
      >
        <Pressable
          onPress={openAdd}
          style={styles.fab}
        >
          <Plus
            size={34}
            color="#080808"
            strokeWidth={2.5}
          />
        </Pressable>
      </Animated.View>

      <AddItemModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editingItem={editingItem}
      />

      {/* DELETE CONFIRMATION */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  miniTitle: {
    color: '#B6FF00',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 31,
  },

  headingAccent: {
    color: '#B6FF00',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34,
  },

  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#303030',
  },

  historyText: {
    color: '#B6FF00',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  statsCard: {
    borderRadius: 26,
    padding: 19,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#303800',
  },

  statsTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  statsLabel: {
    color: '#778000',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  statsAmount: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    marginTop: 5,
  },

  itemsBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#B6FF00',
  },

  itemsNumber: {
    color: '#080808',
    fontSize: 19,
    fontWeight: '900',
  },

  itemsLabel: {
    color: '#080808',
    fontSize: 7,
    fontWeight: '900',
  },

  progressTrack: {
    height: 7,
    borderRadius: 20,
    backgroundColor: '#333900',
    overflow: 'hidden',
    marginTop: 17,
  },

  progressBar: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#B6FF00',
  },

  statsBottom: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginTop: 8,
  },

  progressText: {
    color: '#727272',
    fontSize: 10,
  },

  percent: {
    color: '#B6FF00',
    fontSize: 10,
    fontWeight: '900',
  },

  searchBox: {
    height: 55,
    borderRadius: 18,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#272727',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
    gap: 9,
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  statusTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 13,
  },

  statusTab: {
    flex: 1,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  activeStatusTab: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  statusText: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '900',
  },

  activeStatusText: {
    color: '#080808',
  },

  statusCount: {
    color: '#555555',
    fontSize: 10,
    fontWeight: '800',
  },

  activeStatusCount: {
    color: '#273000',
  },

  categoryList: {
    paddingBottom: 20,
  },

  listHeader: {
    marginBottom: 12,
  },

  listTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  listSubtitle: {
    color: '#555555',
    fontSize: 10,
    marginTop: 3,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 55,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  emptyText: {
    color: '#5C5C5C',
    fontSize: 12,
    marginTop: 6,
  },

  fabWrapper: {
    position: 'absolute',
    right: 22,
    bottom: 25,
  },

  fab: {
    width: 65,
    height: 65,
    borderRadius: 23,
    backgroundColor: '#B6FF00',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
});

export default HomeScreen;