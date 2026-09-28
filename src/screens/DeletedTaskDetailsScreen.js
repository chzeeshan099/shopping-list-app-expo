import React, {
  useContext,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  TaskContext,
} from '../context/TaskContext';

export default function DeletedTaskDetailsScreen({
  route,
  navigation,
}) {
  const { taskId } =
    route.params;

  const {
    getDeletedTask,
    restoreTask,
    permanentlyDeleteTask,
  } = useContext(TaskContext);

  const task =
    getDeletedTask(taskId);

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center px-5">

        <Text className="text-2xl font-bold text-gray-800">
          Task Not Found
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          className="bg-black px-6 py-3 rounded-xl mt-5"
        >
          <Text className="text-white font-semibold">
            Go Back
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }

  const createdDate =
    new Date(
      task.createdAt
    ).toLocaleString();

  const deletedDate =
    new Date(
      task.deletedAt
    ).toLocaleString();

  const dueDate = task.dueDate
    ? new Date(
        task.dueDate
      ).toLocaleDateString()
    : 'No due date';

  const handleRestore = () => {
    Alert.alert(
      'Restore Task',
      'Restore this task back to your task list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Restore',
          onPress: () => {
            restoreTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handlePermanentDelete = () => {
    Alert.alert(
      'Delete Permanently',
      'This task will be permanently deleted and cannot be restored.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete Permanently',
          style: 'destructive',

          onPress: () => {
            permanentlyDeleteTask(
              task.id
            );

            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >

        {/* Deleted Banner */}
        <View className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">

          <Text className="text-red-700 font-bold">
            🗑️ Deleted Task
          </Text>

          <Text className="text-red-600 text-sm mt-1">
            This task is currently in
            History.
          </Text>

        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900">
          {task.title}
        </Text>

        {/* Status */}
        <View
          className={`self-start px-4 py-2 rounded-xl mt-4 ${
            task.completed
              ? 'bg-green-100'
              : 'bg-orange-100'
          }`}
        >
          <Text
            className={`font-bold ${
              task.completed
                ? 'text-green-700'
                : 'text-orange-700'
            }`}
          >
            {task.completed
              ? '✓ Completed'
              : '○ Not Completed'}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white rounded-2xl p-5 mt-6">

          <Text className="text-gray-400 text-xs font-bold mb-2">
            DESCRIPTION
          </Text>

          <Text className="text-gray-800 text-base leading-6">
            {task.description}
          </Text>

        </View>

        {/* Information */}
        <View className="bg-white rounded-2xl p-5 mt-4">

          <Text className="text-gray-400 text-xs font-bold mb-3">
            TASK INFORMATION
          </Text>

          <Info
            label="Created Date"
            value={createdDate}
          />

          <Info
            label="Deleted Date"
            value={deletedDate}
          />

          <Info
            label="Due Date"
            value={dueDate}
          />

          <Info
            label="Priority"
            value={
              task.priority
            }
          />

          <Info
            label="Important"
            value={
              task.important
                ? '⭐ Yes'
                : 'No'
            }
          />

        </View>

        {/* Restore */}
        <TouchableOpacity
          onPress={handleRestore}
          className="bg-green-500 py-4 rounded-xl mt-6"
        >
          <Text className="text-white text-center font-bold text-base">
            ♻️ Restore Task
          </Text>
        </TouchableOpacity>

        {/* Permanent Delete */}
        <TouchableOpacity
          onPress={
            handlePermanentDelete
          }
          className="bg-red-500 py-4 rounded-xl mt-3"
        >
          <Text className="text-white text-center font-bold">
            🗑️ Delete Permanently
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100">

      <Text className="text-gray-500">
        {label}
      </Text>

      <Text className="text-gray-800 font-semibold text-right flex-1 ml-5">
        {value}
      </Text>

    </View>
  );
}