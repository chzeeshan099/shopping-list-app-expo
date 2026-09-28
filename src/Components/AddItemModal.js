import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const categories = [
  ['Food', '🍔'],
  ['Drinks', '🥤'],
  ['Home', '🏠'],
  ['Personal', '🧴'],
  ['Other', '📦'],
];

const AddItemModal = ({
  visible,
  onClose,
  onSave,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');

  const animation = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (visible) {
      setName(editingItem?.name || '');
      setQuantity(
        editingItem?.quantity?.toString() || '1'
      );
      setPrice(
        editingItem?.price?.toString() || ''
      );
      setCategory(
        editingItem?.category || 'Food'
      );

      Animated.spring(animation, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, editingItem]);

  const save = () => {
    if (!name.trim()) {
      return;
    }

    onSave({
      name,
      quantity,
      price,
      category,
    });

    setName('');
    setQuantity('1');
    setPrice('');
    setCategory('Food');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {editingItem
                  ? 'EDIT ITEM'
                  : 'ADD ITEM'}
              </Text>

              <Text style={styles.subtitle}>
                Keep your shopping locked in ⚡
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.close}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="What are you buying?"
            placeholderTextColor="#5E5E5E"
            style={styles.input}
            autoFocus
          />

          <View style={styles.row}>
            <View style={styles.smallInputBox}>
              <Text style={styles.label}>
                QUANTITY
              </Text>

              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.smallInput}
              />
            </View>

            <View style={styles.smallInputBox}>
              <Text style={styles.label}>
                PRICE
              </Text>

              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#555"
                style={styles.smallInput}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            CATEGORY
          </Text>

          <View style={styles.categories}>
            {categories.map(([title, icon]) => (
              <Pressable
                key={title}
                onPress={() => setCategory(title)}
                style={[
                  styles.category,
                  category === title &&
                    styles.activeCategory,
                ]}
              >
                <Text>{icon}</Text>

                <Text
                  style={[
                    styles.categoryText,
                    category === title &&
                      styles.activeCategoryText,
                  ]}
                >
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={save}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>
              {editingItem
                ? 'UPDATE ITEM'
                : 'ADD TO LIST'}
            </Text>

            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.78)',
  },

  modal: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 22,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: '#292929',
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#363636',
    alignSelf: 'center',
    marginBottom: 22,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 1,
  },

  subtitle: {
    color: '#707070',
    marginTop: 4,
    fontSize: 12,
  },

  close: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
  },

  input: {
    height: 58,
    borderRadius: 17,
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#292929',
    paddingHorizontal: 17,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 13,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  smallInputBox: {
    flex: 1,
    backgroundColor: '#191919',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: '#292929',
  },

  label: {
    color: '#656565',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  smallInput: {
    height: 38,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#656565',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 10,
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  category: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#292929',
  },

  activeCategory: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  categoryText: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '800',
  },

  activeCategoryText: {
    color: '#090909',
  },

  saveButton: {
    height: 58,
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: '#B6FF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#080808',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  arrow: {
    color: '#080808',
    fontSize: 23,
    fontWeight: '900',
    marginLeft: 12,
  },
});

export default AddItemModal;