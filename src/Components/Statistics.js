import React, {
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  Animated,
} from 'react-native';

export default function Statistics({
  total,
  completed,
  pending,
  important,
  percentage,
}) {
  const progress = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="bg-white rounded-2xl p-4 mb-4">

      <Text className="text-lg font-bold text-gray-900 mb-3">
        📊 Statistics
      </Text>

      <View className="flex-row gap-2">

        <Stat
          value={total}
          label="Total"
        />

        <Stat
          value={completed}
          label="Completed"
        />

        <Stat
          value={pending}
          label="Pending"
        />

        <Stat
          value={important}
          label="Important"
        />

      </View>

      <View className="mt-4">

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">
            Completion
          </Text>

          <Text className="font-bold text-gray-800">
            {percentage}%
          </Text>
        </View>

        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">

          <Animated.View
            style={{
              width,
            }}
            className="h-full bg-green-500 rounded-full"
          />

        </View>

      </View>

    </View>
  );
}

function Stat({ value, label }) {
  return (
    <View className="flex-1 bg-gray-100 rounded-xl py-3">

      <Text className="text-center text-xl font-bold text-gray-900">
        {value}
      </Text>

      <Text className="text-center text-xs text-gray-500 mt-1">
        {label}
      </Text>

    </View>
  );
}