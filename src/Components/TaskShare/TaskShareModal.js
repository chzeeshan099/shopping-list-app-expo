import React, {
  useRef,
  useState,
} from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { captureRef } from 'react-native-view-shot';

import TaskShareCard from './TaskShareCard';

import {
  shareTaskImage,
} from '../../utils/shareTask';

export default function TaskShareModal({
  visible,
  task,
  onClose,
}) {
  const [selectedDesign, setSelectedDesign] =
    useState('design-1');

  const [sharing, setSharing] =
    useState(false);

  const cardRef = useRef(null);

  const designs = [
    {
      id: 'design-1',
      name: 'Minimal',
      emoji: '✨',
      description: 'Clean & simple',
    },

    {
      id: 'design-2',
      name: 'Modern',
      emoji: '🚀',
      description: 'Fresh & colorful',
    },

    {
      id: 'design-3',
      name: 'Premium',
      emoji: '💎',
      description: 'Dark & elegant',
    },
  ];

  const handleShare = async () => {
    try {
      if (!cardRef.current) {
        Alert.alert(
          'Error',
          'Share card is not ready yet.'
        );

        return;
      }

      setSharing(true);

      /*
      Capture the currently selected
      design as PNG.
      */

      const imageUri =
        await captureRef(
          cardRef.current,
          {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          }
        );

      console.log(
        'Generated image:',
        imageUri
      );

      await shareTaskImage(imageUri);

    } catch (error) {
      console.error(
        'Share task error:',
        error
      );

      Alert.alert(
        'Share Failed',
        'Could not create the task image.'
      );
    } finally {
      setSharing(false);
    }
  };

  console.log(task,'task_task')

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >

      <View className="flex-1 bg-black/50 justify-end">

        <View className="bg-gray-50 rounded-t-[32px] max-h-[95%]">

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">

            <View>
              <Text className="text-gray-900 text-2xl font-extrabold">
                Share Task
              </Text>

              <Text className="text-gray-500 text-sm mt-1">
                Choose your favorite design
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
            >
              <Text className="text-gray-700 text-xl">
                ✕
              </Text>
            </TouchableOpacity>

          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 25,
            }}
          >

            {/* Design Selector */}
            <View className="px-5 mt-3">

              <Text className="text-gray-900 font-bold text-base mb-3">
                Select Design
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >

                {designs.map((design) => {
                  const selected =
                    selectedDesign === design.id;

                  return (
                    <TouchableOpacity
                      key={design.id}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelectedDesign(
                          design.id
                        )
                      }
                      className={`mr-3 w-[115px] rounded-2xl p-4 border-2 ${
                        selected
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >

                      <Text className="text-3xl">
                        {design.emoji}
                      </Text>

                      <Text
                        className={`font-extrabold mt-2 ${
                          selected
                            ? 'text-orange-600'
                            : 'text-gray-800'
                        }`}
                      >
                        {design.name}
                      </Text>

                      <Text className="text-gray-400 text-xs mt-1">
                        {design.description}
                      </Text>

                      {selected && (
                        <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            ✓
                          </Text>
                        </View>
                      )}

                    </TouchableOpacity>
                  );
                })}

              </ScrollView>

            </View>

            {/* Preview */}
            <View className="px-5 mt-6">

              <Text className="text-gray-900 font-bold text-base mb-3">
                Preview
              </Text>

              <View className="bg-gray-200 rounded-3xl p-5 items-center overflow-hidden">

                <TaskShareCard
                  ref={cardRef}
                  task={task}
                  design={selectedDesign}
                />

              </View>

            </View>

            {/* Share Button */}
            <View className="px-5 mt-6">

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={sharing}
                onPress={handleShare}
                className={`py-4 rounded-2xl items-center justify-center ${
                  sharing
                    ? 'bg-gray-400'
                    : 'bg-orange-500'
                }`}
              >

                {sharing ? (
                  <View className="flex-row items-center">

                    <ActivityIndicator
                      size="small"
                      color="#ffffff"
                    />

                    <Text className="text-white font-extrabold ml-2">
                      Preparing...
                    </Text>

                  </View>
                ) : (
                  <View className="flex-row items-center">

                    <Text className="text-xl mr-2">
                      📤
                    </Text>

                    <Text className="text-white font-extrabold text-base">
                      Share This Design
                    </Text>

                  </View>
                )}

              </TouchableOpacity>

            </View>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}