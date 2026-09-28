import React, {
  useEffect,
  useRef,
} from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

const options = [
  {
    value: 'newest',
    label: 'Newest First',
    icon: '🆕',
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: '📅',
  },
  {
    value: 'priority',
    label: 'Priority',
    icon: '🏷️',
  },
  {
    value: 'dueDate',
    label: 'Due Date',
    icon: '⏰',
  },
];

export default function SortModal({
  visible,
  selected,
  onSelect,
  onClose,
}) {
  const slide = useRef(
    new Animated.Value(300)
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const close = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View className="flex-1 justify-end bg-black/40">

        <Animated.View
          style={{
            transform: [
              {
                translateY: slide,
              },
            ],
          }}
          className="bg-white rounded-t-3xl p-5"
        >

          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />

          <Text className="text-2xl font-bold text-gray-900 mb-5">
            Sort Tasks
          </Text>

          {options.map((option) => {
            const active =
              selected === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                onPress={() =>
                  onSelect(option.value)
                }
                className={`flex-row items-center p-4 rounded-xl mb-2 ${
                  active
                    ? 'bg-black'
                    : 'bg-gray-100'
                }`}
              >

                <Text className="text-xl mr-3">
                  {option.icon}
                </Text>

                <Text
                  className={`flex-1 font-semibold ${
                    active
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}
                >
                  {option.label}
                </Text>

                {active && (
                  <Text className="text-white text-lg">
                    ✓
                  </Text>
                )}

              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={close}
            className="bg-gray-200 py-4 rounded-xl mt-3"
          >
            <Text className="text-center font-bold text-gray-800">
              Close
            </Text>
          </TouchableOpacity>

        </Animated.View>

      </View>
    </Modal>
  );
}