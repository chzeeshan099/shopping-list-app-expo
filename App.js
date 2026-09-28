import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "./global.css";
import AppNavigator from "./src/AppNavigator/AppNavigator";
import { ShoppingProvider } from './src/context/ShoppingContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>

    <ShoppingProvider>
      <AppNavigator />
    </ShoppingProvider>
    
    
    </>
  );
}
