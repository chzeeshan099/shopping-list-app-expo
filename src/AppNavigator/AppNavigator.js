import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AllTasksScreen from '../screens/AllTasksScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DeletedTaskDetailsScreen from '../screens/DeletedTaskDetailsScreen';

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="AllTasks"
        screenOptions={{
          headerShown: true,

          animation:
            'slide_from_right',

          headerShadowVisible: false,

          headerStyle: {
            backgroundColor:
              '#f3f4f6',
          },

          headerTitleStyle: {
            fontWeight: '700',
          },

          contentStyle: {
            backgroundColor:
              '#f3f4f6',
          },
        }}
      >

        {/* All Tasks */}
        <Stack.Screen
          name="AllTasks"
          component={AllTasksScreen}
          options={{
            title: 'Task Manager',
          }}
        />

        {/* Add */}
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: 'Add Task',
          }}
        />

        {/* Details */}
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            title: 'Task Details',
          }}
        />

        {/* Edit */}
        <Stack.Screen
          name="EditTask"
          component={EditTaskScreen}
          options={{
            title: 'Edit Task',
          }}
        />

        {/* History */}
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'Deleted Tasks',
          }}
        />

        {/* Deleted Details */}
        <Stack.Screen
          name="DeletedTaskDetails"
          component={
            DeletedTaskDetailsScreen
          }
          options={{
            title: 'Deleted Task',
          }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}