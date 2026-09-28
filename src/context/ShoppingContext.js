import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  loadItems,
  saveItems,
  clearItems,
} from '../utils/storage';

const ShoppingContext = createContext();

export const ShoppingProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const savedItems = await loadItems();
    setItems(savedItems);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      saveItems(items);
    }
  }, [items, loading]);

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

  const updateItem = (id, updatedData) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              quantity: Number(updatedData.quantity) || 1,
              price: Number(updatedData.price) || 0,
            }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

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

  const deletePurchased = () => {
    setItems((prev) =>
      prev.filter((item) => !item.purchased)
    );
  };

  const resetAll = async () => {
    setItems([]);
    await clearItems();
  };

  const stats = useMemo(() => {
    const totalItems = items.length;

    const purchasedItems = items.filter(
      (item) => item.purchased
    ).length;

    const pendingItems = totalItems - purchasedItems;

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const purchasedAmount = items
      .filter((item) => item.purchased)
      .reduce(
        (sum, item) =>
          sum + Number(item.price) * Number(item.quantity),
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
        loading,
        stats,
        addItem,
        updateItem,
        deleteItem,
        togglePurchased,
        deletePurchased,
        resetAll,
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