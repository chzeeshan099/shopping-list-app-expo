import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';


const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>

      <Stack.Navigator
        // initialRouteName="Home"
        screenOptions={{
          headerShown: false,

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

        {/* Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home Screen',
          }}
        />

      

     

      

       

      

      </Stack.Navigator>

    </NavigationContainer>
  );
}