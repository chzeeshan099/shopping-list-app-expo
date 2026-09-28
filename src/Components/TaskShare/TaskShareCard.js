import React, {
  forwardRef,
} from 'react';

import {
  View,
  Text,
} from 'react-native';

const TaskShareCard = forwardRef(
  (
    {
      task,
      design = 'design-1',
    },
    ref
  ) => {
    if (!task) {
      return null;
    }

    const priorityData = {
      high: {
        label: 'High Priority',
        emoji: '🔴',
      },

      medium: {
        label: 'Medium Priority',
        emoji: '🟡',
      },

      low: {
        label: 'Low Priority',
        emoji: '🟢',
      },
    };

    const priority =
      priorityData[task.priority] ||
      priorityData.medium;

    const dueDate = task.dueDate
      ? new Date(
          task.dueDate
        ).toLocaleDateString()
      : 'No due date';

    const status = task.completed
      ? 'Completed'
      : 'Pending';

    /*
    ========================================
    DESIGN 1 - MINIMAL
    ========================================
    */

    if (design === 'design-1') {
      return (
        <View
          ref={ref}
          collapsable={false}
          className="w-[340px] bg-white rounded-3xl p-6"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">

            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase">
                My Todo
              </Text>

              <Text className="text-gray-900 text-xl font-extrabold mt-1">
                Task
              </Text>
            </View>

            <View className="w-11 h-11 rounded-full bg-green-100 items-center justify-center">
              <Text className="text-xl">
                ✓
              </Text>
            </View>

          </View>

          {/* Task */}
          <Text className="text-gray-900 text-2xl font-extrabold">
            {task.title}
          </Text>

          {task.description ? (
            <Text
            //   numberOfLines={4}
              className="text-gray-500 text-sm mt-3 leading-5"
            >
              {task.description}
            </Text>
          ) : null}

          {/* Divider */}
          <View className="h-[1px] bg-gray-200 my-5" />

          {/* Information */}
          <View className="gap-3">

            <View className="flex-row justify-between">
              <Text className="text-gray-400 text-sm">
                Priority
              </Text>

              <Text className="text-gray-800 font-bold">
                {priority.emoji} {priority.label}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-400 text-sm">
                Due Date
              </Text>

              <Text className="text-gray-800 font-bold">
                📅 {dueDate}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-400 text-sm">
                Status
              </Text>

              <Text className="text-gray-800 font-bold">
                {task.completed
                  ? '✅ Completed'
                  : '⏳ Pending'}
              </Text>
            </View>

          </View>

          {/* Footer */}
          <View className="mt-6 pt-4 border-t border-gray-100">
            <Text className="text-gray-400 text-xs text-center">
              Created with Todo App
            </Text>
          </View>

        </View>
      );
    }

    /*
    ========================================
    DESIGN 2 - MODERN
    ========================================
    */

    if (design === 'design-2') {
      return (
        <View
          ref={ref}
          collapsable={false}
          className="w-[340px] bg-orange-500 rounded-[28px] p-6"
        >

          {/* Top */}
          <View className="flex-row items-center justify-between">

            <View>
              <Text className="text-orange-100 text-xs font-bold uppercase">
                Today's Task
              </Text>

              <Text className="text-white text-lg font-extrabold mt-1">
                Stay Productive 🚀
              </Text>
            </View>

            <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center">
              <Text className="text-2xl">
                📝
              </Text>
            </View>

          </View>

          {/* Task Box */}
          <View className="bg-white rounded-3xl p-5 mt-6">

            <Text
            //   numberOfLines={3}
              className="text-gray-900 text-2xl font-extrabold"
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text
                // numberOfLines={3}
                className="text-gray-500 mt-3 leading-5"
              >
                {task.description}
              </Text>
            ) : null}

            {/* Badges */}
            <View className="flex-row flex-wrap gap-2 mt-5">

              <View className="bg-red-50 px-3 py-2 rounded-xl">
                <Text className="text-red-600 text-xs font-bold">
                  {priority.emoji} {priority.label}
                </Text>
              </View>

              <View className="bg-blue-50 px-3 py-2 rounded-xl">
                <Text className="text-blue-600 text-xs font-bold">
                  📅 {dueDate}
                </Text>
              </View>

            </View>

          </View>

          {/* Status */}
          <View className="flex-row items-center justify-between mt-5">

            <Text className="text-orange-100 text-sm font-semibold">
              Task Status
            </Text>

            <View className="bg-white px-4 py-2 rounded-full">
              <Text className="text-orange-600 text-xs font-extrabold">
                {status}
              </Text>
            </View>

          </View>

          <Text className="text-orange-100 text-xs text-center mt-5">
            Todo App
          </Text>

        </View>
      );
    }

    /*
    ========================================
    DESIGN 3 - PREMIUM
    ========================================
    */

    return (
      <View
        ref={ref}
        collapsable={false}
        className="w-[340px] bg-gray-950 rounded-[30px] p-6"
      >

        {/* Header */}
        <View className="flex-row items-center justify-between">

          <View>
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              TASK
            </Text>

            <Text className="text-white text-lg font-extrabold mt-1">
              Focus Mode
            </Text>
          </View>

          <View className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
            <Text className="text-xl">
              ⚡
            </Text>
          </View>

        </View>

        {/* Main */}
        <View className="mt-8">

          <Text
            // numberOfLines={4}
            className="text-white text-3xl font-extrabold leading-9"
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
            //   numberOfLines={4}
              className="text-gray-400 mt-4 leading-5"
            >
              {task.description}
            </Text>
          ) : null}

        </View>

        {/* Information */}
        <View className="mt-8 gap-4">

          <View className="flex-row items-center justify-between">

            <Text className="text-gray-500">
              Priority
            </Text>

            <Text className="text-white font-bold">
              {priority.emoji} {priority.label}
            </Text>

          </View>

          <View className="flex-row items-center justify-between">

            <Text className="text-gray-500">
              Due
            </Text>

            <Text className="text-white font-bold">
              {dueDate}
            </Text>

          </View>

          <View className="flex-row items-center justify-between">

            <Text className="text-gray-500">
              Status
            </Text>

            <Text className="text-white font-bold">
              {task.completed
                ? '✓ Completed'
                : '○ Pending'}
            </Text>

          </View>

        </View>

        {/* Footer */}
        <View className="mt-8 pt-5 border-t border-gray-800">

          <Text className="text-gray-500 text-xs text-center">
            Organize. Focus. Complete.
          </Text>

        </View>

      </View>
    );
  }
);

export default TaskShareCard;