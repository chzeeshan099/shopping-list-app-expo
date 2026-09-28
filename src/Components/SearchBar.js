import React from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

export default function SearchBar({
  value,
  onChangeText,
}) {
  return (
    <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center mb-4">

      <Text className="text-xl mr-2">
        🔍
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search tasks..."
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-gray-800 text-base"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
        >
          <Text className="text-gray-400 text-lg">
            ✕
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
}