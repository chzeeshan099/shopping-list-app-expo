import React, { useRef } from 'react';

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ShoppingItem = ({
  item,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const total =
    Number(item.quantity) * Number(item.price);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={() => onToggle(item.id)}
        onLongPress={() => onEdit(item)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.card,
          item.purchased && styles.completedCard,
        ]}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>
            {item.category === 'Food'
              ? '🍔'
              : item.category === 'Drinks'
              ? '🥤'
              : item.category === 'Home'
              ? '🏠'
              : item.category === 'Personal'
              ? '🧴'
              : '🛒'}
          </Text>
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.name,
              item.purchased && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text style={styles.meta}>
            {item.quantity} × ${Number(item.price).toFixed(2)}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.total}>
            ${total.toFixed(2)}
          </Text>

          <Pressable
            onPress={() => onDelete(item.id)}
            hitSlop={12}
          >
            <Text style={styles.delete}>×</Text>
          </Pressable>

          <View
            style={[
              styles.checkbox,
              item.purchased && styles.checked,
            ]}
          >
            {item.purchased && (
              <Text style={styles.check}>✓</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  card: {
    minHeight: 78,
    borderRadius: 22,
    padding: 12,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#252525',
    flexDirection: 'row',
    alignItems: 'center',
  },

  completedCard: {
    opacity: 0.58,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 24,
  },

  content: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: '#777777',
  },

  meta: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
  },

  right: {
    alignItems: 'flex-end',
    minWidth: 65,
  },

  total: {
    color: '#B6FF00',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },

  delete: {
    position: 'absolute',
    right: -2,
    top: 18,
    color: '#666666',
    fontSize: 18,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#414141',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checked: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  check: {
    color: '#080808',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default ShoppingItem;