import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import ListsScreen from '../screens/ListsScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import BackupScreen from '../screens/BackupScreen';

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lists"
        screenOptions={{
          headerShown: false,
          animation:
            'slide_from_right',
          contentStyle: {
            backgroundColor:
              '#080808',
          },
        }}
      >
        <Stack.Screen
          name="Lists"
          component={ListsScreen}
        />

        <Stack.Screen
          name="ListDetail"
          component={ListDetailScreen}
        />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
        />

        <Stack.Screen
          name="Statistics"
          component={
            StatisticsScreen
          }
        />

        <Stack.Screen
          name="Templates"
          component={
            TemplatesScreen
          }
        />

        <Stack.Screen
          name="Backup"
          component={BackupScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;