import React, {
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskContext } from '../context/TaskContext';

import TaskCard from '../Components/TaskCard';
import SearchBar from '../Components/SearchBar';
import SortModal from '../Components/SortModal';
import Statistics from '../Components/Statistics';

export default function AllTasksScreen({
  navigation,
}) {
  const {
    tasks,
    loading,
    deleteTask,
    toggleTask,
    toggleImportant,

    totalTasks,
    completedTasks,
    pendingTasks,
    importantTasks,
    completionPercentage,
  } = useContext(TaskContext);

  const [activeTab, setActiveTab] =
    useState('all');

  const [search, setSearch] =
    useState('');

  const [sortBy, setSortBy] =
    useState('newest');

  const [sortVisible, setSortVisible] =
    useState(false);

  // Filter + Search + Sort
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Tabs
    if (activeTab === 'completed') {
      result = result.filter(
        (task) => task.completed
      );
    }

    if (activeTab === 'pending') {
      result = result.filter(
        (task) => !task.completed
      );
    }

    if (activeTab === 'important') {
      result = result.filter(
        (task) => task.important
      );
    }

    // Search
    if (search.trim()) {
      const keyword =
        search.toLowerCase();

      result = result.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(keyword) ||
          task.description
            .toLowerCase()
            .includes(keyword)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    if (sortBy === 'oldest') {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
    }

    if (sortBy === 'priority') {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      result.sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );
    }

    if (sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      });
    }

    return result;
  }, [
    tasks,
    activeTab,
    search,
    sortBy,
  ]);

  const handleDelete = (id) => {
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

          onPress: () =>
            deleteTask(id),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">

        <ActivityIndicator
          size="large"
          color="#000"
        />

        <Text className="text-gray-500 mt-3">
          Loading tasks...
        </Text>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}

        ListHeaderComponent={
          <>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">

              <View>
                <Text className="text-3xl font-bold text-gray-900">
                  My Tasks
                </Text>

                <Text className="text-gray-500 mt-1">
                  Organize your day
                </Text>
              </View>

              <View className="flex-row items-center gap-2">

  <TouchableOpacity
    onPress={() =>
      navigation.navigate('History')
    }
    className="bg-white px-4 py-3 rounded-xl"
  >
    <Text className="text-lg">
      🗑️
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      navigation.navigate('AddTask')
    }
    className="bg-black px-5 py-3 rounded-xl"
  >
    <Text className="text-white font-bold">
      + Add
    </Text>
  </TouchableOpacity>

</View>

            </View>

            {/* Statistics */}
            <Statistics
              total={totalTasks}
              completed={completedTasks}
              pending={pendingTasks}
              important={importantTasks}
              percentage={
                completionPercentage
              }
            />

            {/* Search */}
            <SearchBar
              value={search}
              onChangeText={setSearch}
            />

            {/* Filter + Sort */}
            <View className="flex-row mb-4">

              <View className="flex-1 bg-white rounded-xl p-1 flex-row mr-2">

                <Tab
                  label="All"
                  active={
                    activeTab === 'all'
                  }
                  onPress={() =>
                    setActiveTab('all')
                  }
                />

                <Tab
                  label="Done"
                  active={
                    activeTab ===
                    'completed'
                  }
                  onPress={() =>
                    setActiveTab(
                      'completed'
                    )
                  }
                />

                <Tab
                  label="Pending"
                  active={
                    activeTab ===
                    'pending'
                  }
                  onPress={() =>
                    setActiveTab(
                      'pending'
                    )
                  }
                />

                <Tab
                  label="⭐"
                  active={
                    activeTab ===
                    'important'
                  }
                  onPress={() =>
                    setActiveTab(
                      'important'
                    )
                  }
                />

              </View>

              <TouchableOpacity
                onPress={() =>
                  setSortVisible(true)
                }
                className="bg-white px-4 rounded-xl justify-center"
              >
                <Text className="text-lg">
                  ↕️
                </Text>
              </TouchableOpacity>

            </View>

            {/* Result count */}
            <View className="flex-row justify-between items-center mb-3">

              <Text className="text-gray-600 font-semibold">
                {activeTab === 'all'
                  ? 'All Tasks'
                  : activeTab ===
                    'completed'
                  ? 'Completed Tasks'
                  : activeTab ===
                    'pending'
                  ? 'Pending Tasks'
                  : 'Important Tasks'}
              </Text>

              <Text className="text-gray-400">
                {filteredTasks.length} task
                {filteredTasks.length !==
                1
                  ? 's'
                  : ''}
              </Text>

            </View>
          </>
        }

        ListEmptyComponent={
          <View className="items-center mt-16">

            <Text className="text-6xl mb-4">
              📝
            </Text>

            <Text className="text-xl font-bold text-gray-800">
              No Tasks Found
            </Text>

            <Text className="text-gray-500 text-center mt-2 px-5">
              {search
                ? 'No tasks match your search.'
                : activeTab === 'completed'
                ? 'No completed tasks yet.'
                : activeTab === 'pending'
                ? 'No pending tasks.'
                : activeTab ===
                  'important'
                ? 'No important tasks.'
                : 'Create your first task.'}
            </Text>

            {!search &&
              activeTab === 'all' && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'AddTask'
                    )
                  }
                  className="bg-black px-6 py-3 rounded-xl mt-5"
                >
                  <Text className="text-white font-bold">
                    + Create Task
                  </Text>
                </TouchableOpacity>
              )}

          </View>
        }

        renderItem={({ item }) => (
          <TaskCard
            task={item}

            onPress={() =>
              navigation.navigate(
                'TaskDetails',
                {
                  taskId: item.id,
                }
              )
            }

            onToggle={() =>
              toggleTask(item.id)
            }

            onImportant={() =>
              toggleImportant(item.id)
            }

            onEdit={() =>
              navigation.navigate(
                'EditTask',
                {
                  taskId: item.id,
                }
              )
            }

            onDelete={() =>
              handleDelete(item.id)
            }
          />
        )}
      />

      {/* Sort Modal */}
      <SortModal
        visible={sortVisible}
        selected={sortBy}
        onSelect={(value) => {
          setSortBy(value);
          setSortVisible(false);
        }}
        onClose={() =>
          setSortVisible(false)
        }
      />

    </SafeAreaView>
  );
}

function Tab({
  label,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-2 rounded-lg ${
        active
          ? 'bg-black'
          : 'bg-white'
      }`}
    >
      <Text
        className={`text-center text-xs font-bold ${
          active
            ? 'text-white'
            : 'text-gray-600'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}