import React from 'react';
import AppNavigator from "./src/AppNavigator/AppNavigator";
import { ShoppingProvider } from './src/context/ShoppingContext';
import "./global.css";

export default function App() {
  return (
    <>
    <ShoppingProvider>
      <AppNavigator />
    </ShoppingProvider>
    </>
  );
}
