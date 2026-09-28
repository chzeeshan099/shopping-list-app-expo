import React, { useRef } from 'react';

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Check,
  CheckCircle2,
  Edit3,
  Trash2,
} from 'lucide-react-native';

const ShoppingItem = ({
  item,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const total =
    Number(item.quantity) *
    Number(item.price);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <View
        style={[
          styles.card,
          item.purchased &&
            styles.completedCard,
        ]}
      >
        {/* PRODUCT ICON */}
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
              : '📦'}
          </Text>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              item.purchased &&
                styles.completedName,
            ]}
          >
            {item.name}
          </Text>

          <Text style={styles.meta}>
            {item.quantity} × $
            {Number(item.price).toFixed(2)}
          </Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightSide}>
          <Text style={styles.total}>
            ${total.toFixed(2)}
          </Text>

          {/* THREE BUTTONS SAME ROW */}
          <View style={styles.actions}>
            {/* EDIT */}
            <Pressable
              onPress={() => onEdit(item)}
              style={[
                styles.actionButton,
                styles.editButton,
              ]}
            >
              <Edit3
                size={15}
                color="#FFFFFF"
                strokeWidth={2.5}
              />
            </Pressable>

            {/* COMPLETE */}
            <Pressable
              onPress={() =>
                onToggle(item.id)
              }
              style={[
                styles.actionButton,
                item.purchased
                  ? styles.completedButton
                  : styles.completeButton,
              ]}
            >
              {item.purchased ? (
                <Check
                  size={16}
                  color="#080808"
                  strokeWidth={3}
                />
              ) : (
                <CheckCircle2
                  size={16}
                  color="#B6FF00"
                  strokeWidth={2.5}
                />
              )}
            </Pressable>

            {/* DELETE */}
            <Pressable
              onPress={() => onDelete(item)}
              style={[
                styles.actionButton,
                styles.deleteButton,
              ]}
            >
              <Trash2
                size={15}
                color="#FF5A5A"
                strokeWidth={2.5}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  card: {
    minHeight: 91,
    borderRadius: 22,
    padding: 11,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
  },

  completedCard: {
    borderColor: '#354000',
    backgroundColor: '#121500',
  },

  iconBox: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  icon: {
    fontSize: 24,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },

  completedName: {
    color: '#6D6D6D',
    textDecorationLine: 'line-through',
  },

  meta: {
    color: '#707070',
    fontSize: 11,
    fontWeight: '600',
  },

  rightSide: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  total: {
    color: '#B6FF00',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionButton: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  editButton: {
    backgroundColor: '#242424',
    borderColor: '#3A3A3A',
  },

  completeButton: {
    backgroundColor: '#242900',
    borderColor: '#596600',
  },

  completedButton: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  deleteButton: {
    backgroundColor: '#281717',
    borderColor: '#4A2525',
  },
});

export default ShoppingItem;