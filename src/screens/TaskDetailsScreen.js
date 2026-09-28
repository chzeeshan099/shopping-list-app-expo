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

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TaskContext,
} from '../context/TaskContext';

export default function TaskDetailsScreen({
  route,
  navigation,
}) {
  const { taskId } = route.params;

  const {
    getTask,
    toggleTask,
    toggleImportant,
    deleteTask,
  } = useContext(TaskContext);

  const task = getTask(taskId);

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">

        <Text className="text-2xl font-bold">
          Task Not Found
        </Text>

      </SafeAreaView>
    );
  }

  const createdDate =
    new Date(
      task.createdAt
    ).toLocaleString();

  const dueDate = task.dueDate
    ? new Date(
        task.dueDate
      ).toLocaleDateString()
    : 'No due date';

  const priorityData = {
    high: {
      label: 'High',
      icon: '🔴',
    },

    medium: {
      label: 'Medium',
      icon: '🟡',
    },

    low: {
      label: 'Low',
      icon: '🟢',
    },
  };

  const priority =
    priorityData[task.priority] ||
    priorityData.medium;

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => {
            deleteTask(task.id);
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

        {/* Title */}
        <View className="flex-row items-start">

          <Text className="flex-1 text-3xl font-bold text-gray-900">
            {task.title}
          </Text>

          <TouchableOpacity
            onPress={() =>
              toggleImportant(task.id)
            }
            className="ml-3"
          >
            <Text className="text-3xl">
              {task.important
                ? '⭐'
                : '☆'}
            </Text>
          </TouchableOpacity>

        </View>

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

          <Text className="text-gray-400 text-xs font-bold mb-4">
            TASK INFORMATION
          </Text>

          <Info
            label="Created Date"
            value={createdDate}
          />

          <Info
            label="Due Date"
            value={dueDate}
          />

          <Info
            label="Priority"
            value={`${priority.icon} ${priority.label}`}
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

        {/* Complete */}
        <TouchableOpacity
          onPress={() =>
            toggleTask(task.id)
          }
          className={`py-4 rounded-xl mt-6 ${
            task.completed
              ? 'bg-orange-500'
              : 'bg-green-500'
          }`}
        >
          <Text className="text-white text-center font-bold text-base">
            {task.completed
              ? '↩ Mark as Not Completed'
              : '✓ Mark as Completed'}
          </Text>
        </TouchableOpacity>

        {/* Edit */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'EditTask',
              {
                taskId: task.id,
              }
            )
          }
          className="bg-blue-500 py-4 rounded-xl mt-3"
        >
          <Text className="text-white text-center font-bold">
            ✏️ Edit Task
          </Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 py-4 rounded-xl mt-3"
        >
          <Text className="text-white text-center font-bold">
            🗑️ Delete Task
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