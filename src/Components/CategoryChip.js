import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

const CategoryChip = ({
  title,
  icon,
  active,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale }] }}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.chip,
          active && styles.activeChip,
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>

        <Text
          style={[
            styles.text,
            active && styles.activeText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chip: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
  },

  activeChip: {
    backgroundColor: '#B6FF00',
    borderColor: '#B6FF00',
  },

  icon: {
    fontSize: 15,
    marginRight: 6,
  },

  text: {
    color: '#8D8D8D',
    fontSize: 13,
    fontWeight: '700',
  },

  activeText: {
    color: '#080808',
  },
});

export default CategoryChip;