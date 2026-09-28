import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEMS_KEY = '@shoplist_items';
const DELETED_KEY = '@shoplist_deleted_items';

const ShoppingContext = createContext();

export const ShoppingProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const savedItems = await AsyncStorage.getItem(ITEMS_KEY);
      const savedDeleted = await AsyncStorage.getItem(DELETED_KEY);

      setItems(savedItems ? JSON.parse(savedItems) : []);
      setDeletedItems(
        savedDeleted ? JSON.parse(savedDeleted) : []
      );
    } catch (error) {
      console.log('Storage load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        ITEMS_KEY,
        JSON.stringify(items)
      );
    }
  }, [items, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        DELETED_KEY,
        JSON.stringify(deletedItems)
      );
    }
  }, [deletedItems, loading]);

  // ADD
  const addItem = ({
    name,
    quantity,
    price,
    category,
  }) => {
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      category,
      purchased: false,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
  };

  // UPDATE
  const updateItem = (id, updatedData) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              quantity:
                Number(updatedData.quantity) || 1,
              price:
                Number(updatedData.price) || 0,
            }
          : item
      )
    );
  };

  // DELETE → HISTORY
  const deleteItem = (id) => {
    const itemToDelete = items.find(
      (item) => item.id === id
    );

    if (!itemToDelete) return;

    const deletedItem = {
      ...itemToDelete,
      deletedAt: new Date().toISOString(),
    };

    setDeletedItems((prev) => [
      deletedItem,
      ...prev,
    ]);

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // COMPLETE / UNCOMPLETE
  const togglePurchased = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              purchased: !item.purchased,
            }
          : item
      )
    );
  };

  // RESTORE FROM HISTORY
  const restoreItem = (id) => {
    const item = deletedItems.find(
      (item) => item.id === id
    );

    if (!item) return;

    const restoredItem = {
      ...item,
      purchased: false,
    };

    delete restoredItem.deletedAt;

    setItems((prev) => [
      restoredItem,
      ...prev,
    ]);

    setDeletedItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // PERMANENT DELETE
  const permanentlyDelete = (id) => {
    setDeletedItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // PERMANENT DELETE MULTIPLE
  const permanentlyDeleteMany = (ids) => {
    setDeletedItems((prev) =>
      prev.filter((item) => !ids.includes(item.id))
    );
  };

  // RESTORE MULTIPLE
  const restoreMany = (ids) => {
    const selectedItems = deletedItems.filter(
      (item) => ids.includes(item.id)
    );

    const restoredItems = selectedItems.map(
      (item) => {
        const restored = {
          ...item,
          purchased: false,
        };

        delete restored.deletedAt;

        return restored;
      }
    );

    setItems((prev) => [
      ...restoredItems,
      ...prev,
    ]);

    setDeletedItems((prev) =>
      prev.filter((item) => !ids.includes(item.id))
    );
  };

  const stats = useMemo(() => {
    const totalItems = items.length;

    const purchasedItems = items.filter(
      (item) => item.purchased
    ).length;

    const pendingItems =
      totalItems - purchasedItems;

    const totalAmount = items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    );

    const purchasedAmount = items
      .filter((item) => item.purchased)
      .reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    const progress =
      totalItems === 0
        ? 0
        : purchasedItems / totalItems;

    return {
      totalItems,
      purchasedItems,
      pendingItems,
      totalAmount,
      purchasedAmount,
      progress,
    };
  }, [items]);

  return (
    <ShoppingContext.Provider
      value={{
        items,
        deletedItems,
        loading,
        stats,

        addItem,
        updateItem,
        deleteItem,
        togglePurchased,

        restoreItem,
        permanentlyDelete,
        restoreMany,
        permanentlyDeleteMany,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error(
      'useShopping must be used inside ShoppingProvider'
    );
  }

  return context;
};