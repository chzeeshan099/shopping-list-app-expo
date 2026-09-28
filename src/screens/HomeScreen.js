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

import { LinearGradient } from 'expo-linear-gradient';

import ShoppingItem from '../Components/ShoppingItem';
import CategoryChip from '../Components/CategoryChip';
import AddItemModal from '../Components/AddItemModal';
import { useShopping } from '../context/ShoppingContext';

const categories = [
  ['All', '⚡'],
  ['Food', '🍔'],
  ['Drinks', '🥤'],
  ['Home', '🏠'],
  ['Personal', '🧴'],
  ['Other', '📦'],
];

const HomeScreen = () => {
  const {
    items,
    stats,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
  } = useShopping();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingItem, setEditingItem] =
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
          toValue: 1.06,
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
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

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
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }

    setEditingItem(null);
    setModalVisible(false);
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
                    outputRange: [-25, 0],
                  }),
              },
            ],
          },
        ]}
      >
        <View>
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

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
      </Animated.View>

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
              ${stats.totalAmount.toFixed(2)}
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
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${Math.max(
                  stats.progress * 100,
                  stats.totalItems ? 5 : 0
                )}%`,
              },
            ]}
          />
        </View>

        <View style={styles.statsBottom}>
          <Text style={styles.progressText}>
            {stats.purchasedItems} of {stats.totalItems}{' '}
            purchased
          </Text>

          <Text style={styles.percent}>
            {Math.round(stats.progress * 100)}%
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

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
            <Text style={styles.clear}>×</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <CategoryChip
            title={item[0]}
            icon={item[1]}
            active={
              selectedCategory === item[0]
            }
            onPress={() =>
              setSelectedCategory(item[0])
            }
          />
        )}
      />

      <View style={styles.listHeader}>
        <View>
          <Text style={styles.listTitle}>
            YOUR LIST
          </Text>

          <Text style={styles.listSubtitle}>
            {filteredItems.length} items
          </Text>
        </View>

        {stats.purchasedItems > 0 && (
          <Text style={styles.doneText}>
            {stats.purchasedItems} DONE ✓
          </Text>
        )}
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
            onDelete={deleteItem}
            onEdit={openEdit}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
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
              Hit the + button and build your list.
            </Text>
          </View>
        }
      />

      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [{ scale: fabScale }],
          },
        ]}
      >
        <Pressable
          onPress={openAdd}
          style={styles.fab}
        >
          <Text style={styles.fabPlus}>+</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    letterSpacing: -1,
  },

  headingAccent: {
    color: '#B6FF00',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 34,
    letterSpacing: -1,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#B6FF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#080808',
    fontSize: 18,
    fontWeight: '900',
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
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
    marginTop: 8,
  },

  progressText: {
    color: '#727272',
    fontSize: 10,
    fontWeight: '600',
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
    marginBottom: 14,
  },

  searchIcon: {
    color: '#B6FF00',
    fontSize: 25,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  clear: {
    color: '#777777',
    fontSize: 22,
  },

  categoryList: {
    paddingBottom: 23,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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

  doneText: {
    color: '#B6FF00',
    fontSize: 9,
    fontWeight: '900',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
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

    shadowColor: '#B6FF00',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },

  fabPlus: {
    color: '#080808',
    fontSize: 35,
    fontWeight: '400',
    marginTop: -3,
  },
});

export default HomeScreen;