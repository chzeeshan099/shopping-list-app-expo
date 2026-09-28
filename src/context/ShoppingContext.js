import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shopping_app_v2';

const ShoppingContext = createContext(null);

const createDefaultList = () => ({
  id: `list_${Date.now()}`,
  name: 'Weekly Groceries',
  emoji: '🛒',
  budget: 100,
  createdAt: new Date().toISOString(),
});

const templates = [
  {
    id: 'weekly',
    name: 'Weekly Groceries',
    emoji: '🛒',
    items: [
      ['Milk', 'Food', 2, 4],
      ['Bread', 'Food', 1, 3],
      ['Eggs', 'Food', 12, 5],
      ['Apples', 'Food', 4, 6],
      ['Chicken', 'Food', 1, 10],
    ],
  },
  {
    id: 'party',
    name: 'Party Night',
    emoji: '🎉',
    items: [
      ['Drinks', 'Drinks', 6, 3],
      ['Chips', 'Food', 4, 2],
      ['Pizza', 'Food', 2, 12],
      ['Cups', 'Home', 1, 5],
    ],
  },
  {
    id: 'home',
    name: 'Home Essentials',
    emoji: '🏠',
    items: [
      ['Tissue', 'Home', 4, 3],
      ['Soap', 'Personal', 3, 2],
      ['Detergent', 'Home', 1, 8],
      ['Trash Bags', 'Home', 2, 5],
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    emoji: '✈️',
    items: [
      ['Water', 'Drinks', 4, 1],
      ['Snacks', 'Food', 5, 2],
      ['Toothbrush', 'Personal', 1, 3],
    ],
  },
];

export const ShoppingProvider = ({
  children,
}) => {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState([]);
  const [deletedItems, setDeletedItems] =
    useState([]);
  const [activeListId, setActiveListId] =
    useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        const data = JSON.parse(saved);

        setLists(data.lists || []);
        setItems(data.items || []);
        setDeletedItems(
          data.deletedItems || []
        );

        setActiveListId(
          data.activeListId ||
            data.lists?.[0]?.id ||
            null
        );
      } else {
        const firstList =
          createDefaultList();

        setLists([firstList]);
        setItems([]);
        setDeletedItems([]);
        setActiveListId(firstList.id);
      }
    } catch (error) {
      console.log(
        'Storage error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lists,
        items,
        deletedItems,
        activeListId,
      })
    );
  }, [
    lists,
    items,
    deletedItems,
    activeListId,
    loading,
  ]);

  // -----------------------------
  // ACTIVE LIST
  // -----------------------------

  const activeList = useMemo(() => {
    return (
      lists.find(
        (list) =>
          list.id === activeListId
      ) || lists[0]
    );
  }, [lists, activeListId]);

  const activeItems = useMemo(() => {
    if (!activeListId) return [];

    return items.filter(
      (item) =>
        item.listId === activeListId
    );
  }, [items, activeListId]);

  // -----------------------------
  // LISTS
  // -----------------------------

  const createList = ({
    name,
    emoji = '🛒',
    budget = 0,
  }) => {
    const newList = {
      id: `list_${Date.now()}`,
      name:
        name?.trim() || 'New Shopping List',
      emoji,
      budget: Number(budget) || 0,
      createdAt:
        new Date().toISOString(),
    };

    setLists((prev) => [
      newList,
      ...prev,
    ]);

    setActiveListId(newList.id);

    return newList;
  };

  const updateList = (
    id,
    updates
  ) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id
          ? {
              ...list,
              ...updates,
              budget:
                updates.budget !== undefined
                  ? Number(
                      updates.budget
                    ) || 0
                  : list.budget,
            }
          : list
      )
    );
  };

  const deleteList = (id) => {
    if (lists.length <= 1) {
      return false;
    }

    setLists((prev) =>
      prev.filter(
        (list) => list.id !== id
      )
    );

    setItems((prev) =>
      prev.filter(
        (item) => item.listId !== id
      )
    );

    if (activeListId === id) {
      const remaining =
        lists.filter(
          (list) => list.id !== id
        );

      setActiveListId(
        remaining[0]?.id || null
      );
    }

    return true;
  };

  const selectList = (id) => {
    setActiveListId(id);
  };

  // -----------------------------
  // ITEMS
  // -----------------------------

  const addItem = ({
    name,
    quantity = 1,
    price = 0,
    category = 'Other',
  }) => {
    if (!activeListId) return;

    const newItem = {
      id: `item_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`,
      listId: activeListId,
      name: name.trim(),
      quantity:
        Number(quantity) || 1,
      price: Number(price) || 0,
      category,
      purchased: false,
      favorite: false,
      createdAt:
        new Date().toISOString(),
    };

    setItems((prev) => [
      newItem,
      ...prev,
    ]);
  };

  const addItemToList = (
    listId,
    data
  ) => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`,
      listId,
      name: data.name.trim(),
      quantity:
        Number(data.quantity) || 1,
      price: Number(data.price) || 0,
      category:
        data.category || 'Other',
      purchased: false,
      favorite: false,
      createdAt:
        new Date().toISOString(),
    };

    setItems((prev) => [
      newItem,
      ...prev,
    ]);
  };

  const updateItem = (
    id,
    updates
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              quantity:
                updates.quantity !==
                undefined
                  ? Number(
                      updates.quantity
                    ) || 1
                  : item.quantity,
              price:
                updates.price !==
                undefined
                  ? Number(
                      updates.price
                    ) || 0
                  : item.price,
            }
          : item
      )
    );
  };

  const updateQuantity = (
    id,
    change
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id)
          return item;

        return {
          ...item,
          quantity: Math.max(
            1,
            Number(item.quantity) +
              change
          ),
        };
      })
    );
  };

  const togglePurchased = (
    id
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              purchased:
                !item.purchased,
            }
          : item
      )
    );
  };

  const toggleFavorite = (
    id
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite:
                !item.favorite,
            }
          : item
      )
    );
  };

  // -----------------------------
  // DELETE / HISTORY
  // -----------------------------

  const deleteItem = (id) => {
    const item = items.find(
      (item) => item.id === id
    );

    if (!item) return;

    setDeletedItems((prev) => [
      {
        ...item,
        deletedAt:
          new Date().toISOString(),
      },
      ...prev,
    ]);

    setItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const restoreMany = (ids) => {
    const selected =
      deletedItems.filter((item) =>
        ids.includes(item.id)
      );

    const restored = selected.map(
      (item) => {
        const clean = {
          ...item,
          purchased: false,
        };

        delete clean.deletedAt;

        return clean;
      }
    );

    setItems((prev) => [
      ...restored,
      ...prev,
    ]);

    setDeletedItems((prev) =>
      prev.filter(
        (item) =>
          !ids.includes(item.id)
      )
    );
  };

  const permanentlyDeleteMany = (
    ids
  ) => {
    setDeletedItems((prev) =>
      prev.filter(
        (item) =>
          !ids.includes(item.id)
      )
    );
  };

  // -----------------------------
  // BUDGET
  // -----------------------------

  const setBudget = (
    amount
  ) => {
    if (!activeListId) return;

    updateList(activeListId, {
      budget:
        Number(amount) || 0,
    });
  };

  // -----------------------------
  // FAVORITES
  // -----------------------------

  const favoriteItems =
    useMemo(() => {
      return activeItems.filter(
        (item) => item.favorite
      );
    }, [activeItems]);

  const recentlyAdded =
    useMemo(() => {
      return [...activeItems]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);
    }, [activeItems]);

  // -----------------------------
  // STATISTICS
  // -----------------------------

  const allStats = useMemo(() => {
    const totalItems =
      items.length;

    const completedItems =
      items.filter(
        (item) => item.purchased
      ).length;

    const pendingItems =
      totalItems -
      completedItems;

    const totalSpent =
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    const completedAmount =
      items
        .filter(
          (item) => item.purchased
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.price) *
              Number(item.quantity),
          0
        );

    const favoriteCount =
      items.filter(
        (item) => item.favorite
      ).length;

    return {
      totalItems,
      completedItems,
      pendingItems,
      totalSpent,
      completedAmount,
      favoriteCount,
      totalLists: lists.length,
    };
  }, [items, lists]);

  const activeStats = useMemo(() => {
    const total =
      activeItems.length;

    const completed =
      activeItems.filter(
        (item) => item.purchased
      ).length;

    const pending =
      total - completed;

    const totalCost =
      activeItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    const completedCost =
      activeItems
        .filter(
          (item) => item.purchased
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.price) *
              Number(item.quantity),
          0
        );

    const remainingCost =
      totalCost - completedCost;

    const budget =
      Number(activeList?.budget) || 0;

    const budgetPercent =
      budget > 0
        ? Math.min(
            (totalCost / budget) *
              100,
            100
          )
        : 0;

    const budgetRemaining =
      Math.max(
        budget - totalCost,
        0
      );

    return {
      total,
      completed,
      pending,
      totalCost,
      completedCost,
      remainingCost,
      budget,
      budgetPercent,
      budgetRemaining,
      progress:
        total === 0
          ? 0
          : (completed / total) *
            100,
    };
  }, [activeItems, activeList]);

  // -----------------------------
  // TEMPLATES
  // -----------------------------

  const addTemplate = (
    template
  ) => {
    const list = createList({
      name: template.name,
      emoji: template.emoji,
      budget: 100,
    });

    template.items.forEach(
      (item) => {
        addItemToList(
          list.id,
          {
            name: item[0],
            category: item[1],
            quantity: item[2],
            price: item[3],
          }
        );
      }
    );

    return list;
  };

  // -----------------------------
  // BACKUP DATA
  // -----------------------------

  const getBackupData = () => {
    return {
      app: 'ShopList',
      version: 2,
      exportedAt:
        new Date().toISOString(),
      lists,
      items,
      deletedItems,
    };
  };

  return (
    <ShoppingContext.Provider
      value={{
        loading,

        lists,
        items: activeItems,
        allItems: items,
        deletedItems,

        activeList,
        activeListId,

        favoriteItems,
        recentlyAdded,

        stats: activeStats,
        allStats,

        templates,

        addItem,
        addItemToList,
        updateItem,
        updateQuantity,
        togglePurchased,
        toggleFavorite,

        deleteItem,
        restoreMany,
        permanentlyDeleteMany,

        createList,
        updateList,
        deleteList,
        selectList,

        setBudget,

        addTemplate,

        getBackupData,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context =
    useContext(
      ShoppingContext
    );

  if (!context) {
    throw new Error(
      'useShopping must be used inside ShoppingProvider'
    );
  }

  return context;
};