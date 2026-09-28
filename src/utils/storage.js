import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shoplist_items';

export const saveItems = async (items) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.log('Save items error:', error);
  }
};

export const loadItems = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log('Load items error:', error);
    return [];
  }
};

export const clearItems = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log('Clear items error:', error);
  }
};