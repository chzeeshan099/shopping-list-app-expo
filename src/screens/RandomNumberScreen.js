import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HistoryContext } from '../context/HistoryContext';
import Button from '../Components/Button';

export default function RandomNumberScreen() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [range, setRange] = useState(10);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedRange, setSelectedRange] = useState(10); // Track the selected range
  const { history, addEntry, clearHistory } = useContext(HistoryContext);

  const generateRandomNumber = () => {
    const newNumber = Math.floor(Math.random() * range) + 1;
    setRandomNumber(newNumber);
    addEntry({ expression: `Random: 1 - ${range}`, result: newNumber.toString() });
  };

  useEffect(() => {
    if (autoGenerate) {
      const id = setInterval(generateRandomNumber, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [autoGenerate, range]);

  const rangeButtons = [
    { label: '1–10', range: 10 },
    { label: '1–50', range: 50 },
    { label: '1–100', range: 100 },
  ];

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-100">
      <View className="bg-white p-6 rounded-3xl shadow-lg mb-4">
        <Text className="text-gray-400 text-right text-lg">{`Range: 1 - ${range}`}</Text>
        <Animated.Text className="text-gray-800 text-5xl font-bold text-center mt-5">
          {randomNumber}
        </Animated.Text>

        <Button onPress={generateRandomNumber} style="bg-black" textStyle="text-white mt-5">
          Generate
        </Button>

        {/* View History Button */}
        <Button onPress={() => setHistoryOpen(true)} style="bg-blue-600 mt-4" textStyle="text-white">
          View History
        </Button>

        <Text className="text-center text-lg mt-5">Select Range</Text>
        <View className="flex-row justify-around mt-4">
          {rangeButtons.map((btn, index) => (
            <Button
              key={index}
              onPress={() => {
                setRange(btn.range);
                setSelectedRange(btn.range); // Set the selected range when button is pressed
              }}
              style={`${
                selectedRange === btn.range ? 'bg-green-500' : 'bg-gray-200'
              }`}
              textStyle="text-gray-800"
            >
             {btn.label}
            </Button>
          ))}
        </View>

        <Button
          onPress={() => setAutoGenerate((prev) => !prev)}
          style={`mt-5 ${autoGenerate ? 'bg-red-500' : 'bg-green-500'}`}
          textStyle="text-white"
        >
          {autoGenerate ? 'Stop Auto Generate' : 'Start Auto Generate'}
        </Button>
      </View>

      {/* History Modal */}
      <Modal visible={historyOpen} animationType="slide">
        <SafeAreaView className="flex-1 p-5 bg-gray-100">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-gray-800">History</Text>
            <TouchableOpacity onPress={() => setHistoryOpen(false)}>
              <Text className="text-blue-600 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {history.length === 0 ? (
              <Text className="text-center text-gray-500">No history yet</Text>
            ) : (
              history.map((item, idx) => (
                <View
                  key={idx}
                  className="bg-white p-4 rounded-xl mb-3 shadow-sm"
                >
                  <Text className="text-gray-600">{item.expression}</Text>
                  <Text className="text-gray-800 font-bold text-lg">
                    {item.result}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          <Button onPress={clearHistory} style="bg-red-500 mt-4" textStyle="text-white">
            Clear History
          </Button>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}