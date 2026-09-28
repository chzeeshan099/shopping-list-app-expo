import React, {
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react-native';

import { useShopping } from '../context/ShoppingContext';

const EMOJIS = [
  '🛒',
  '🏠',
  '🎉',
  '✈️',
  '🏋️',
  '🎮',
  '💼',
];

const ListsScreen = ({
  navigation,
}) => {
  const {
    lists,
    allItems,
    createList,
    deleteList,
    selectList,
  } = useShopping();

  const [modal, setModal] =
    useState(false);

  const [name, setName] =
    useState('');

  const [budget, setBudget] =
    useState('');

  const [emoji, setEmoji] =
    useState('🛒');

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert(
        'Missing name',
        'Please enter a list name.'
      );
      return;
    }

    createList({
      name,
      emoji,
      budget,
    });

    setName('');
    setBudget('');
    setEmoji('🛒');
    setModal(false);
  };

  const openList = (list) => {
    selectList(list.id);

    navigation.navigate(
      'ListDetail',
      {
        listId: list.id,
      }
    );
  };

  const handleDelete = (list) => {
    Alert.alert(
      'Delete List',
      `Delete "${list.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteList(list.id),
        },
      ]
    );
  };

  const getListStats = (id) => {
    const listItems =
      allItems.filter(
        (item) =>
          item.listId === id
      );

    const total =
      listItems.length;

    const completed =
      listItems.filter(
        (item) =>
          item.purchased
      ).length;

    const cost =
      listItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    return {
      total,
      completed,
      cost,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>
            SHOPLIST ⚡
          </Text>

          <Text style={styles.title}>
            MY LISTS
          </Text>

          <Text style={styles.subtitle}>
            Everything in one place.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            setModal(true)
          }
          style={styles.addButton}
        >
          <Plus
            size={22}
            color="#080808"
          />
        </Pressable>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
        }
        renderItem={({ item }) => {
          const stats =
            getListStats(item.id);

          return (
            <Pressable
              onPress={() =>
                openList(item)
              }
              style={({ pressed }) => [
                styles.card,
                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={styles.emojiBox}
              >
                <Text
                  style={styles.emoji}
                >
                  {item.emoji}
                </Text>
              </View>

              <View
                style={styles.info}
              >
                <Text
                  style={styles.name}
                >
                  {item.name}
                </Text>

                <Text
                  style={styles.meta}
                >
                  {stats.total} items •{' '}
                  {stats.completed}{' '}
                  complete
                </Text>

                <View
                  style={
                    styles.progressTrack
                  }
                >
                  <View
                    style={[
                      styles.progress,
                      {
                        width: `${
                          stats.total
                            ? (stats.completed /
                                stats.total) *
                              100
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View
                style={styles.right}
              >
                <Text
                  style={styles.price}
                >
                  $
                  {stats.cost.toFixed(
                    2
                  )}
                </Text>

                <View
                  style={
                    styles.actions
                  }
                >
                  <Pressable
                    onPress={() =>
                      handleDelete(
                        item
                      )
                    }
                    style={
                      styles.deleteButton
                    }
                  >
                    <Trash2
                      size={15}
                      color="#FF5A5A"
                    />
                  </Pressable>

                  <ChevronRight
                    size={20}
                    color="#555555"
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <Modal
        visible={modal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModal(false)
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modal}
          >
            <Text
              style={styles.modalTitle}
            >
              NEW SHOPPING LIST
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="List name"
              placeholderTextColor="#555"
              style={styles.input}
            />

            <TextInput
              value={budget}
              onChangeText={setBudget}
              placeholder="Budget e.g. 100"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <Text
              style={styles.label}
            >
              CHOOSE ICON
            </Text>

            <View
              style={styles.emojiRow}
            >
              {EMOJIS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() =>
                    setEmoji(item)
                  }
                  style={[
                    styles.emojiChoice,
                    emoji === item &&
                      styles.activeEmoji,
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 24,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View
              style={styles.modalButtons}
            >
              <Pressable
                onPress={() =>
                  setModal(false)
                }
                style={styles.cancel}
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  CANCEL
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCreate}
                style={styles.create}
              >
                <Text
                  style={
                    styles.createText
                  }
                >
                  CREATE LIST
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  kicker: {
    color: '#B6FF00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },

  subtitle: {
    color: '#555',
    fontSize: 11,
    marginTop: 3,
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#B6FF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    padding: 18,
    paddingTop: 0,
  },

  card: {
    minHeight: 102,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 23,
    marginBottom: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  emojiBox: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  emoji: {
    fontSize: 29,
  },

  info: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  meta: {
    color: '#666',
    fontSize: 10,
    marginTop: 5,
  },

  progressTrack: {
    height: 5,
    backgroundColor: '#2C3000',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },

  progress: {
    height: '100%',
    backgroundColor: '#B6FF00',
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  price: {
    color: '#B6FF00',
    fontSize: 14,
    fontWeight: '900',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
    gap: 5,
  },

  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#291717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#151515',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 22,
    paddingBottom: 35,
    borderWidth: 1,
    borderColor: '#292929',
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 18,
  },

  input: {
    height: 52,
    backgroundColor: '#202020',
    borderRadius: 15,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#303030',
  },

  label: {
    color: '#666',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 9,
  },

  emojiRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  emojiChoice: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeEmoji: {
    backgroundColor: '#B6FF00',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  cancel: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#777',
    fontWeight: '900',
    fontSize: 10,
  },

  create: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#B6FF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createText: {
    color: '#080808',
    fontWeight: '900',
    fontSize: 10,
  },
});

export default ListsScreen;