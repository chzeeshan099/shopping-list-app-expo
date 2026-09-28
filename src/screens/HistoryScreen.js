import React, {
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ArrowLeft,
  Check,
  RotateCcw,
  Trash2,
} from 'lucide-react-native';

import { useShopping } from '../context/ShoppingContext';

const HistoryScreen = ({
  navigation,
}) => {
  const {
    deletedItems,
    restoreMany,
    permanentlyDeleteMany,
  } = useShopping();

  const [selectedIds, setSelectedIds] =
    useState([]);

  const allSelected =
    deletedItems.length > 0 &&
    selectedIds.length ===
      deletedItems.length;

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (itemId) => itemId !== id
          )
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        deletedItems.map(
          (item) => item.id
        )
      );
    }
  };

  const restoreSelected = () => {
    if (!selectedIds.length) return;

    restoreMany(selectedIds);
    setSelectedIds([]);
  };

  const permanentlyDeleteSelected =
    () => {
      if (!selectedIds.length) return;

      permanentlyDeleteMany(
        selectedIds
      );

      setSelectedIds([]);
    };

  const renderItem = ({
    item,
  }) => {
    const selected =
      selectedIds.includes(item.id);

    const total =
      Number(item.price) *
      Number(item.quantity);

    return (
      <Pressable
        onPress={() =>
          toggleSelection(item.id)
        }
        style={[
          styles.card,
          selected &&
            styles.selectedCard,
        ]}
      >
        <View
          style={[
            styles.checkbox,
            selected &&
              styles.checkedBox,
          ]}
        >
          {selected && (
            <Check
              size={15}
              color="#080808"
              strokeWidth={3}
            />
          )}
        </View>

        <View style={styles.iconBox}>
          <Text style={styles.emoji}>
            {item.category === 'Food'
              ? '🍔'
              : item.category === 'Drinks'
              ? '🥤'
              : item.category === 'Home'
              ? '🏠'
              : item.category === 'Personal'
              ? '🧴'
              : '📦'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.meta}>
            {item.quantity} × $
            {Number(item.price).toFixed(
              2
            )}
          </Text>
        </View>

        <Text style={styles.price}>
          ${total.toFixed(2)}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080808"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <ArrowLeft
            size={21}
            color="#FFFFFF"
          />
        </Pressable>

        <View>
          <Text style={styles.title}>
            HISTORY
          </Text>

          <Text style={styles.subtitle}>
            Deleted shopping items
          </Text>
        </View>

        <View style={{ width: 42 }} />
      </View>

      {/* SELECT ALL */}
      {deletedItems.length > 0 && (
        <View style={styles.selectRow}>
          <Pressable
            onPress={selectAll}
            style={styles.selectButton}
          >
            <View
              style={[
                styles.smallCheckbox,
                allSelected &&
                  styles.checkedBox,
              ]}
            >
              {allSelected && (
                <Check
                  size={13}
                  color="#080808"
                  strokeWidth={3}
                />
              )}
            </View>

            <Text style={styles.selectText}>
              {allSelected
                ? 'DESELECT ALL'
                : 'SELECT ALL'}
            </Text>
          </Pressable>

          <Text style={styles.count}>
            {deletedItems.length} deleted
          </Text>
        </View>
      )}

      <FlatList
        data={deletedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              🗑️
            </Text>

            <Text style={styles.emptyTitle}>
              HISTORY IS EMPTY
            </Text>

            <Text style={styles.emptyText}>
              Deleted items will appear here.
            </Text>
          </View>
        }
      />

      {/* ACTION BAR */}
      {selectedIds.length > 0 && (
        <View style={styles.actionBar}>
          <View>
            <Text style={styles.selectedNumber}>
              {selectedIds.length}
            </Text>

            <Text style={styles.selectedLabel}>
              SELECTED
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={restoreSelected}
              style={styles.restoreButton}
            >
              <RotateCcw
                size={17}
                color="#080808"
              />

              <Text style={styles.restoreText}>
                RESTORE
              </Text>
            </Pressable>

            <Pressable
              onPress={
                permanentlyDeleteSelected
              }
              style={styles.permanentButton}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  header: {
    height: 82,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#191919',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  subtitle: {
    color: '#5E5E5E',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 3,
  },

  selectRow: {
    height: 55,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  smallCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#484848',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectText: {
    color: '#A0A0A0',
    fontSize: 10,
    fontWeight: '900',
  },

  count: {
    color: '#555555',
    fontSize: 10,
  },

  list: {
    padding: 18,
    paddingTop: 5,
    paddingBottom: 130,
  },

  card: {
    minHeight: 76,
    borderRadius: 20,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#282828',
    marginBottom: 10,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedCard: {
    borderColor: '#B6FF00',
    backgroundColor: '#161A08',
  },

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  checkedBox: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  emoji: {
    fontSize: 22,
  },

  info: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  meta: {
    color: '#666666',
    fontSize: 10,
    marginTop: 5,
  },

  price: {
    color: '#777777',
    fontSize: 13,
    fontWeight: '900',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 120,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  emptyText: {
    color: '#555555',
    fontSize: 11,
    marginTop: 7,
  },

  actionBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 18,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#343434',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  selectedNumber: {
    color: '#B6FF00',
    fontSize: 19,
    fontWeight: '900',
  },

  selectedLabel: {
    color: '#666666',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 9,
  },

  restoreButton: {
    height: 44,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: '#B6FF00',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  restoreText: {
    color: '#080808',
    fontSize: 10,
    fontWeight: '900',
  },

  permanentButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#291717',
    borderWidth: 1,
    borderColor: '#4C2828',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryScreen;