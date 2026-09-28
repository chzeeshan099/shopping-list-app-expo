import React, {
  useRef,
} from 'react';

import {
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function Button({
  children,
  onPress,
  className = '',
  textClassName = '',
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        className={`py-4 rounded-xl ${className}`}
      >
        <Text
          className={`text-center font-bold text-base ${textClassName}`}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}