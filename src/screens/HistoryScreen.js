import React, {
  useContext,
  useRef,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  TaskContext,
} from '../context/TaskContext';

export default function HistoryScreen({
  navigation,
}) {
  const {
    deletedTasks,
    restoreTask,
    permanentlyDeleteTask,
  } = useContext(TaskContext);

  const handleRestore = (id) => {
    Alert.alert(
      'Restore Task',
      'Do you want to restore this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Restore',
          onPress: () => {
            restoreTask(id);
          },
        },
      ]
    );
  };

  const handlePermanentDelete = (
    id
  ) => {
    Alert.alert(
      'Delete Permanently',
      'This task will be permanently deleted. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete Permanently',
          style: 'destructive',

          onPress: () => {
            permanentlyDeleteTask(id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      <FlatList
        data={deletedTasks}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
          flexGrow:
            deletedTasks.length === 0
              ? 1
              : 0,
        }}
        showsVerticalScrollIndicator={
          false
        }

        ListHeaderComponent={
          <View className="mb-5">

            <Text className="text-3xl font-bold text-gray-900">
              🗑️ History
            </Text>

            <Text className="text-gray-500 mt-1">
              Deleted tasks
            </Text>

            <View className="bg-orange-50 border border-orange-100 rounded-xl p-3 mt-4">

              <Text className="text-orange-700 text-sm">
                Deleted tasks are kept here
                until you permanently delete
                them or restore them.
              </Text>

            </View>

          </View>
        }

        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">

            <Text className="text-6xl mb-4">
              🗑️
            </Text>

            <Text className="text-xl font-bold text-gray-800">
              No Deleted Tasks
            </Text>

            <Text className="text-gray-500 mt-2 text-center">
              Tasks you delete will appear
              here.
            </Text>

          </View>
        }

        renderItem={({ item }) => (
          <HistoryCard
            task={item}
            onView={() =>
              navigation.navigate(
                'DeletedTaskDetails',
                {
                  taskId: item.id,
                }
              )
            }
            onRestore={() =>
              handleRestore(item.id)
            }
            onDelete={() =>
              handlePermanentDelete(
                item.id
              )
            }
          />
        )}
      />

    </SafeAreaView>
  );
}

function HistoryCard({
  task,
  onView,
  onRestore,
  onDelete,
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const deletedDate = task.deletedAt
    ? new Date(
        task.deletedAt
      ).toLocaleString()
    : 'Unknown';

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale,
          },
        ],
      }}
      className="bg-white rounded-2xl p-4 mb-3"
    >

      {/* Header */}
      <View className="flex-row items-start">

        <TouchableOpacity
          onPress={onView}
          className="flex-1 pr-2"
        >

          <Text
            numberOfLines={1}
            className="text-lg font-bold text-gray-700"
          >
            {task.title}
          </Text>

          <Text
            numberOfLines={2}
            className="text-gray-500 mt-1"
          >
            {task.description}
          </Text>

        </TouchableOpacity>

        <View className="bg-gray-100 px-2 py-1 rounded-lg">

          <Text className="text-xs text-gray-500">
            Deleted
          </Text>

        </View>

      </View>

      {/* Info */}
      <View className="flex-row flex-wrap gap-2 mt-3">

        <View className="bg-gray-100 px-3 py-1 rounded-lg">

          <Text className="text-xs text-gray-600">
            🏷️ {task.priority}
          </Text>

        </View>

        {task.dueDate && (
          <View className="bg-gray-100 px-3 py-1 rounded-lg">

            <Text className="text-xs text-gray-600">
              📅{' '}
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </Text>

          </View>
        )}

      </View>

      <Text className="text-gray-400 text-xs mt-3">
        Deleted: {deletedDate}
      </Text>

      {/* Buttons */}
      <View className="flex-row gap-2 mt-4">

        <TouchableOpacity
          onPress={onView}
          onPressIn={pressIn}
          onPressOut={pressOut}
          className="flex-1 bg-gray-700 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            👁️ View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRestore}
          onPressIn={pressIn}
          onPressOut={pressOut}
          className="flex-1 bg-green-500 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            ♻️ Restore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          onPressIn={pressIn}
          onPressOut={pressOut}
          className="flex-1 bg-red-500 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            🗑️ Delete
          </Text>
        </TouchableOpacity>

      </View>

    </Animated.View>
  );
}