import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const priorities = [
  {
    value: 'low',
    label: 'Low',
    icon: '🟢',
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: '🟡',
  },
  {
    value: 'high',
    label: 'High',
    icon: '🔴',
  },
];

export default function PrioritySelector({
  value,
  onChange,
}) {
  return (
    <View className="flex-row gap-2">

      {priorities.map((item) => {
        const selected =
          value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() =>
              onChange(item.value)
            }
            className={`flex-1 py-3 rounded-xl border ${
              selected
                ? 'bg-black border-black'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                selected
                  ? 'text-white'
                  : 'text-gray-700'
              }`}
            >
              {item.icon} {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}

    </View>
  );
}