import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import generateRandomNumber from "./src/screens/RandomNumberScreen";
import { HistoryProvider } from "./src/context/HistoryContext";
import "./global.css";
import { TaskProvider } from "./src/context/TaskContext";
import AppNavigator from "./src/AppNavigator/AppNavigator";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    {/* <HistoryProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="RandomNumberScreen"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="RandomNumberScreen" component={generateRandomNumber} />

            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </HistoryProvider> */}

    <TaskProvider>
      <AppNavigator />
    </TaskProvider>
    
    </>
  );
}
