import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export const shareTaskImage = async (imageUri) => {
  try {
    if (!imageUri) {
      Alert.alert(
        'Share Error',
        'Task image could not be created.'
      );
      return;
    }

    const isAvailable =
      await Sharing.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        Platform.OS === 'web'
          ? 'Sharing is not available on web.'
          : 'Sharing is not available on this device.'
      );

      return;
    }

    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/png',
      dialogTitle: 'Share Task',
      UTI: 'public.png',
    });
  } catch (error) {
    console.error(
      'Task sharing error:',
      error
    );

    Alert.alert(
      'Share Failed',
      'Something went wrong while sharing the task.'
    );
  }
};