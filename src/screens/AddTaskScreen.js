import React, {
  useContext,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TaskContext,
} from '../context/TaskContext';

import PrioritySelector from '../Components/PrioritySelector';

import Button from '../Components/Button';

export default function AddTaskScreen({
  navigation,
}) {
  const { addTask } =
    useContext(TaskContext);

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [priority, setPriority] =
    useState('medium');

  const [dueDate, setDueDate] =
    useState(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleAdd = () => {
    if (!title.trim()) {
      setError(
        'Please enter task title.'
      );
      return;
    }

    if (!description.trim()) {
      setError(
        'Please enter task description.'
      );
      return;
    }

    addTask({
      title,
      description,
      priority,
      dueDate,
    });

    Alert.alert(
      'Task Created',
      'Your task has been added successfully.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >

          <Text className="text-3xl font-bold text-gray-900">
            Add Task
          </Text>

          <Text className="text-gray-500 mt-2 mb-7">
            Create a new task
          </Text>

          {/* Title */}
          <Text className="font-semibold text-gray-800 mb-2">
            Task Title
          </Text>

          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setError('');
            }}
            placeholder="e.g. Learn React Native"
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-4 text-gray-800 mb-5"
          />

          {/* Description */}
          <Text className="font-semibold text-gray-800 mb-2">
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setError('');
            }}
            placeholder="Write task description..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            className="bg-white rounded-xl px-4 py-4 h-32 text-gray-800 mb-5"
          />

          {/* Priority */}
          <Text className="font-semibold text-gray-800 mb-3">
            🏷️ Priority
          </Text>

          <PrioritySelector
            value={priority}
            onChange={setPriority}
          />

          {/* Due Date */}
          <Text className="font-semibold text-gray-800 mt-6 mb-3">
            📅 Due Date
          </Text>

          <TouchableOpacity
            onPress={() =>
              setShowDatePicker(true)
            }
            className="bg-white rounded-xl px-4 py-4"
          >
            <Text className="text-gray-800">
              {dueDate
                ? dueDate.toLocaleDateString()
                : 'Select due date'}
            </Text>
          </TouchableOpacity>

          {dueDate && (
            <TouchableOpacity
              onPress={() =>
                setDueDate(null)
              }
              className="mt-2"
            >
              <Text className="text-red-500 font-semibold">
                Remove due date
              </Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={
                dueDate ||
                new Date()
              }
              mode="date"
              minimumDate={new Date()}
              onChange={(
                event,
                selectedDate
              ) => {
                setShowDatePicker(false);

                if (selectedDate) {
                  setDueDate(
                    selectedDate
                  );
                }
              }}
            />
          )}

          {/* Error */}
          {error ? (
            <Text className="text-red-500 mt-4">
              {error}
            </Text>
          ) : null}

          {/* Add */}
          <View className="mt-6">

            <Button
              onPress={handleAdd}
              className="bg-black"
              textClassName="text-white"
            >
              ✓ Add Task
            </Button>

          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            className="bg-gray-200 py-4 rounded-xl mt-3"
          >
            <Text className="text-center font-semibold text-gray-800">
              Cancel
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}