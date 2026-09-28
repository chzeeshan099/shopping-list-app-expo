import React, {
  useContext,
  useEffect,
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

export default function EditTaskScreen({
  route,
  navigation,
}) {
  const { taskId } = route.params;

  const {
    getTask,
    updateTask,
  } = useContext(TaskContext);

  const task = getTask(taskId);

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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);

      setDueDate(
        task.dueDate
          ? new Date(task.dueDate)
          : null
      );
    }
  }, [task]);

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">

        <Text className="text-xl font-bold">
          Task Not Found
        </Text>

      </SafeAreaView>
    );
  }

  const handleUpdate = () => {
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

    updateTask(task.id, {
      title,
      description,
      priority,
      dueDate:
        dueDate?.toISOString() ||
        null,
    });

    Alert.alert(
      'Task Updated',
      'Task updated successfully.',
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
            Edit Task
          </Text>

          <Text className="text-gray-500 mt-2 mb-7">
            Update your task
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

          {/* Date */}
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

          {error ? (
            <Text className="text-red-500 mt-4">
              {error}
            </Text>
          ) : null}

          <View className="mt-6">

            <Button
              onPress={handleUpdate}
              className="bg-black"
              textClassName="text-white"
            >
              ✓ Update Task
            </Button>

          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            className="bg-gray-200 py-4 rounded-xl mt-3"
          >
            <Text className="text-center font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}