import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

import TaskShareModal from './TaskShare/TaskShareModal';

export default function TaskCard({
  task,
  onPress,
  onToggle,
  onImportant,
  onEdit,
  onDelete,
}) {
  const fade = useRef(
    new Animated.Value(0)
  ).current;

  const translateY = useRef(
    new Animated.Value(20)
  ).current;

  const starScale = useRef(
    new Animated.Value(1)
  ).current;

  const checkScale = useRef(
    new Animated.Value(1)
  ).current;

  /*
  ========================================
  SHARE MODAL STATE
  ========================================
  */

  const [
    shareVisible,
    setShareVisible,
  ] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleImportant = () => {
    Animated.sequence([
      Animated.spring(starScale, {
        toValue: 1.4,
        useNativeDriver: true,
      }),

      Animated.spring(starScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onImportant();
  };

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1.15,
        useNativeDriver: true,
      }),

      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  const priorityData = {
    high: {
      label: 'High',
      color: 'bg-red-100',
      text: 'text-red-700',
    },

    medium: {
      label: 'Medium',
      color: 'bg-yellow-100',
      text: 'text-yellow-700',
    },

    low: {
      label: 'Low',
      color: 'bg-green-100',
      text: 'text-green-700',
    },
  };

  const priority =
    priorityData[task.priority] ||
    priorityData.medium;

  const dueDateText = task.dueDate
    ? new Date(
        task.dueDate
      ).toLocaleDateString()
    : 'No due date';

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) <
      new Date();

  return (
    <>
      <Animated.View
        style={{
          opacity: fade,
          transform: [
            {
              translateY,
            },
          ],
        }}
        className="bg-white rounded-2xl p-4 mb-3"
      >

        {/* Top */}
        <View className="flex-row items-start">

          <TouchableOpacity
            onPress={onPress}
            className="flex-1 pr-2"
          >

            <View className="flex-row items-center">

              <Text
                numberOfLines={1}
                className={`flex-1 text-lg font-bold ${
                  task.completed
                    ? 'text-gray-400 line-through'
                    : 'text-gray-900'
                }`}
              >
                {task.title}
              </Text>

              {/* SHARE + IMPORTANT */}
              <View className="flex-row items-center">

                {/* SHARE BUTTON */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setShareVisible(true)
                  }
                  className="ml-2 w-9 h-9 rounded-full bg-orange-50 items-center justify-center"
                >
                  <Text className="text-lg">
                    📤
                  </Text>
                </TouchableOpacity>

                {/* IMPORTANT */}
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: starScale,
                      },
                    ],
                  }}
                >

                  <TouchableOpacity
                    onPress={handleImportant}
                    className="ml-2"
                  >
                    <Text className="text-2xl">
                      {task.important
                        ? '⭐'
                        : '☆'}
                    </Text>
                  </TouchableOpacity>

                </Animated.View>

              </View>

            </View>

            <Text
              numberOfLines={2}
              className="text-gray-500 mt-1"
            >
              {task.description}
            </Text>

          </TouchableOpacity>

        </View>

        {/* Meta */}
        <View className="flex-row items-center mt-3 flex-wrap gap-2">

          <View
            className={`px-3 py-1 rounded-lg ${priority.color}`}
          >
            <Text
              className={`text-xs font-bold ${priority.text}`}
            >
              🏷️ {priority.label}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-lg ${
              isOverdue
                ? 'bg-red-100'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isOverdue
                  ? 'text-red-700'
                  : 'text-gray-600'
              }`}
            >
              📅{' '}
              {isOverdue
                ? 'Overdue'
                : dueDateText}
            </Text>
          </View>

        </View>

        {/* Buttons */}
        <View className="flex-row gap-2 mt-4">

          <Animated.View
            style={{
              transform: [
                {
                  scale: checkScale,
                },
              ],
            }}
            className="flex-1"
          >

            <TouchableOpacity
              onPress={handleToggle}
              className={`py-2 rounded-xl ${
                task.completed
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              }`}
            >
              <Text className="text-white text-center font-semibold">
                {task.completed
                  ? '↩ Pending'
                  : '✓ Complete'}
              </Text>
            </TouchableOpacity>

          </Animated.View>

          <TouchableOpacity
            onPress={onEdit}
            className="flex-1 bg-blue-500 py-2 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              ✏️ Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className="flex-1 bg-red-500 py-2 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              🗑️ Delete
            </Text>
          </TouchableOpacity>

        </View>

      </Animated.View>

      {/* ========================================
          TASK SHARE MODAL
          ======================================== */}

      <TaskShareModal
        visible={shareVisible}
        task={task}
        onClose={() =>
          setShareVisible(false)
        }
      />
    </>
  );
}