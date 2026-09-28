import React, { useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AddItemModal from "../Components/Shopping/AddItemModal";

import {
  ArrowLeft,
  Check,
  Edit3,
  Filter,
  Heart,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react-native";

import { useShopping } from "../context/ShoppingContext";

const CATEGORIES = ["All", "Food", "Drinks", "Home", "Personal", "Other"];

const ListDetailScreen = ({ navigation }) => {
  const {
    activeList,
    items,
    stats,
    addItem,
    updateQuantity,
    updateItem,
    togglePurchased,
    toggleFavorite,
    deleteItem,
    recentlyAdded,
  } = useShopping();

  const [search, setSearch] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recent");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --------------------------------------------------
  // FILTER + SORT
  // --------------------------------------------------

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (search.trim()) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter((item) => item.category === category);
    }

    // Favorites
    if (favoritesOnly) {
      result = result.filter((item) => item.favorite);
    }

    // Recently Added
    if (sort === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Name
    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Price Low
    if (sort === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    }

    // Price High
    if (sort === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    }

    // Pending
    if (sort === "pending") {
      result.sort((a, b) => Number(a.purchased) - Number(b.purchased));
    }

    return result;
  }, [items, search, category, sort, favoritesOnly]);

  // --------------------------------------------------
  // QUICK ADD
  // --------------------------------------------------

  const quickAdd = () => {
    if (!quickName.trim()) return;

    addItem({
      name: quickName,
      quantity: 1,
      price: 0,
      category: "Other",
    });

    setQuickName("");
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const deleteCurrent = (item) => {
    Alert.alert("Delete Item", `Move "${item.name}" to History?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(item.id),
      },
    ]);
  };

  // --------------------------------------------------
  // ITEM RENDER
  // --------------------------------------------------

  const renderItem = ({ item }) => {
    const total = Number(item.price) * Number(item.quantity);

    return (
      <View
        className={`bg-[#151515] border border-[#292929] rounded-[21px] p-[11px] mb-[10px] ${
          item.purchased ? "bg-[#121500] border-[#303800]" : ""
        }`}
      >
        <View className="flex-row items-center">
          {/* EMOJI */}
          <View className="w-[50px] h-[50px] rounded-[16px] bg-[#202020] items-center justify-center mr-[10px]">
            <Text className="text-[23px]">
              {item.category === "Food"
                ? "🍔"
                : item.category === "Drinks"
                  ? "🥤"
                  : item.category === "Home"
                    ? "🏠"
                    : item.category === "Personal"
                      ? "🧴"
                      : "📦"}
            </Text>
          </View>

          {/* ITEM INFO */}
          <View className="flex-1">
            <Text
              className={`text-[14px] font-black text-white ${
                item.purchased ? "text-[#666666] line-through" : ""
              }`}
            >
              {item.name}
            </Text>

            <Text className="text-[#666666] text-[9px] mt-[4px]">
              ${Number(item.price).toFixed(2)} each
            </Text>

            {/* QUANTITY */}
            <View className="flex-row items-center mt-[7px] gap-[7px]">
              <Pressable
                onPress={() => updateQuantity(item.id, -1)}
                className="w-[25px] h-[25px] rounded-[8px] bg-[#242424] items-center justify-center"
              >
                <Text className="text-[#B6FF00] text-[16px] font-black">−</Text>
              </Pressable>

              <Text className="text-white text-[11px] font-black">
                {item.quantity}
              </Text>

              <Pressable
                onPress={() => updateQuantity(item.id, 1)}
                className="w-[25px] h-[25px] rounded-[8px] bg-[#242424] items-center justify-center"
              >
                <Text className="text-[#B6FF00] text-[16px] font-black">+</Text>
              </Pressable>
            </View>
          </View>

          {/* RIGHT SIDE */}
          <View className="items-end ml-[7px]">
            <Text className="text-[#B6FF00] text-[14px] font-black mb-[7px]">
              ${total.toFixed(2)}
            </Text>

            {/* ACTIONS */}
            <View className="flex-row gap-[5px]">
              {/* EDIT */}
              <Pressable
               onPress={() => handleEditItem(item)}
                className="w-[29px] h-[29px] rounded-[9px] bg-[#242424] items-center justify-center"
              >
                <Edit3 size={15} color="#B6FF00" />
              </Pressable>

              {/* FAVORITE */}
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                className={`w-[29px] h-[29px] rounded-[9px] items-center justify-center ${
                  item.favorite ? "bg-[#FF6B9A]" : "bg-[#242424]"
                }`}
              >
                <Heart
                  size={15}
                  color={item.favorite ? "#080808" : "#FF6B9A"}
                  fill={item.favorite ? "#080808" : "transparent"}
                />
              </Pressable>

              {/* PURCHASE */}
              <Pressable
                onPress={() => togglePurchased(item.id)}
                className={`w-[29px] h-[29px] rounded-[9px] items-center justify-center ${
                  item.purchased ? "bg-[#B6FF00]" : "bg-[#242424]"
                }`}
              >
                <Check
                  size={16}
                  color={item.purchased ? "#080808" : "#B6FF00"}
                />
              </Pressable>

              {/* DELETE */}
              <Pressable
                onPress={() => deleteCurrent(item)}
                className="w-[29px] h-[29px] rounded-[9px] bg-[#291717] items-center justify-center"
              >
                <Trash2 size={15} color="#FF5A5A" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // NO ACTIVE LIST
  // --------------------------------------------------

  if (!activeList) {
    return null;
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditItemModal(true);
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <View className="flex-1 bg-[#080808]">
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 18,
          paddingTop: 48,
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
        // ------------------------------------------------
        // HEADER
        // ------------------------------------------------

        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View className="flex-row items-center mb-[18px]">
              {/* BACK */}
              <Pressable
                onPress={() => navigation.goBack()}
                className="w-[43px] h-[43px] rounded-[14px] bg-[#171717] items-center justify-center mr-[12px]"
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </Pressable>

              {/* LIST INFO */}
              <View className="flex-1 flex-row items-center">
                <Text className="text-[28px] mr-[9px]">{activeList.emoji}</Text>

                <View>
                  <Text className="text-white text-[20px] font-black">
                    {activeList.name}
                  </Text>

                  <Text className="text-[#555555] text-[10px] mt-[3px]">
                    {stats.total} items
                  </Text>
                </View>
              </View>

              {/* FAVORITES */}
              <Pressable
                onPress={() => setFavoritesOnly(!favoritesOnly)}
                className={`w-[43px] h-[43px] rounded-[14px] items-center justify-center ${
                  favoritesOnly ? "bg-[#FF6B9A]" : "bg-[#171717]"
                }`}
              >
                <Heart
                  size={18}
                  color={favoritesOnly ? "#080808" : "#FF6B9A"}
                  fill={favoritesOnly ? "#080808" : "transparent"}
                />
              </Pressable>
            </View>

            {/* ------------------------------------------------
                BUDGET
            ------------------------------------------------ */}

            <View className="bg-[#151515] border border-[#303800] rounded-[24px] p-[17px] mb-[12px]">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-[#777F00] text-[9px] font-black tracking-[1.5px]">
                    BUDGET
                  </Text>

                  <Text className="text-white text-[25px] font-black mt-[4px]">
                    ${stats.totalCost.toFixed(2)}
                    <Text className="text-[#666666] text-[13px]">
                      {" "}
                      / ${stats.budget.toFixed(2)}
                    </Text>
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-[#666666] text-[8px] font-black">
                    LEFT
                  </Text>

                  <Text className="text-[#B6FF00] text-[15px] font-black mt-[4px]">
                    ${stats.budgetRemaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* PROGRESS */}
              <View className="h-[7px] rounded-[10px] bg-[#292D00] overflow-hidden mt-[15px]">
                <View
                  className="h-full bg-[#B6FF00]"
                  style={{
                    width: `${stats.budgetPercent}%`,
                  }}
                />
              </View>

              <Text className="text-[#666666] text-[9px] mt-[8px]">
                {stats.budget <= 0
                  ? "Set a budget for this list"
                  : stats.totalCost > stats.budget
                    ? "⚠️ Budget exceeded"
                    : `${Math.round(stats.budgetPercent)}% of budget used`}
              </Text>
            </View>

            {/* ------------------------------------------------
                SEARCH
            ------------------------------------------------ */}

            <View className="h-[52px] rounded-[17px] bg-[#151515] border border-[#292929] flex-row items-center px-[14px] gap-[8px] mb-[9px]">
              <Search size={19} color="#B6FF00" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search items..."
                placeholderTextColor="#555"
                className="flex-1 text-white text-[13px]"
              />
            </View>

            {/* ------------------------------------------------
                ADD ITEM
            ------------------------------------------------ */}

            <TouchableOpacity
              onPress={() => setShowAddItemModal(true)}
              activeOpacity={0.85}
              className="min-h-[78px] mx-[2px] mt-[15px] mb-[18px] bg-[#151515] rounded-[20px] border border-[#343434] px-[15px] flex-row items-center"
            >
              {/* ADD ICON */}
              <View className="w-[50px] h-[50px] rounded-[17px] bg-[#9CFF00] items-center justify-center">
                <Ionicons name="add" size={30} color="#050505" />
              </View>

              {/* TEXT */}
              <View className="flex-1 ml-[13px]">
                <Text className="text-white text-[15px] font-black tracking-[1px]">
                  ADD ITEM
                </Text>

                <Text className="text-[#666666] text-[11px] mt-[4px]">
                  Add name, price, quantity & category
                </Text>
              </View>

              <Ionicons name="arrow-forward" size={22} color="#9CFF00" />
            </TouchableOpacity>

            {/* ------------------------------------------------
                SORT / FILTER
            ------------------------------------------------ */}

            <View className="flex-row items-center mb-[13px]">
              {/* SORT BUTTON */}
              <Pressable
                onPress={() => setFilterOpen(!filterOpen)}
                className="h-[38px] px-[12px] rounded-[12px] bg-[#1B1B1B] flex-row items-center gap-[5px] mr-[7px]"
              >
                <SlidersHorizontal size={16} color="#FFFFFF" />

                <Text className="text-white text-[9px] font-black">SORT</Text>
              </Pressable>

              {/* CATEGORIES */}
              <FlatList
                horizontal
                data={CATEGORIES}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setCategory(item)}
                    className={`h-[38px] px-[12px] rounded-[12px] items-center justify-center mr-[7px] border ${
                      category === item
                        ? "bg-[#B6FF00] border-[#B6FF00]"
                        : "bg-[#151515] border-[#292929]"
                    }`}
                  >
                    <Text
                      className={`text-[9px] font-extrabold ${
                        category === item ? "text-[#080808]" : "text-[#666666]"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>

            {/* ------------------------------------------------
                SORT PANEL
            ------------------------------------------------ */}

            {filterOpen && (
              <View className="bg-[#151515] border border-[#292929] rounded-[17px] mb-[13px] overflow-hidden">
                {[
                  ["recent", "Recently Added"],
                  ["name", "Name A → Z"],
                  ["priceLow", "Price Low → High"],
                  ["priceHigh", "Price High → Low"],
                  ["pending", "Pending First"],
                ].map(([value, label]) => (
                  <Pressable
                    key={value}
                    onPress={() => {
                      setSort(value);
                      setFilterOpen(false);
                    }}
                    className={`min-h-[44px] px-[14px] flex-row items-center justify-between ${
                      sort === value ? "bg-[#202500]" : ""
                    }`}
                  >
                    <Text className="text-white text-[11px] font-bold">
                      {label}
                    </Text>

                    {sort === value && <Check size={16} color="#B6FF00" />}
                  </Pressable>
                ))}
              </View>
            )}

            {/* ------------------------------------------------
                RECENTLY ADDED
            ------------------------------------------------ */}

            {recentlyAdded.length > 0 && (
              <View className="mb-[16px]">
                <View className="flex-row items-center mb-[9px] gap-[7px]">
                  <Text className="text-white text-[11px] font-black tracking-[1.3px]">
                    RECENTLY ADDED
                  </Text>

                  <Text className="text-[#B6FF00] text-[9px] font-black">
                    {recentlyAdded.length}
                  </Text>
                </View>

                <FlatList
                  horizontal
                  data={recentlyAdded}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View className="w-[115px] h-[48px] rounded-[14px] bg-[#151515] border border-[#292929] px-[9px] flex-row items-center mr-[7px]">
                      <Text className="text-[15px] mr-[6px]">🆕</Text>

                      <Text
                        numberOfLines={1}
                        className="flex-1 text-[#AAAAAA] text-[9px] font-extrabold"
                      >
                        {item.name}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

            {/* ------------------------------------------------
                YOUR ITEMS HEADER
            ------------------------------------------------ */}

            <View className="flex-row items-center gap-[7px] mb-[9px]">
              <Text className="text-white text-[11px] font-black tracking-[1.3px]">
                YOUR ITEMS
              </Text>

              <Text className="text-[#B6FF00] text-[9px] font-black">
                {filteredItems.length}
              </Text>
            </View>
          </>
        }
        // ------------------------------------------------
        // EMPTY
        // ------------------------------------------------

        ListEmptyComponent={
          <View className="items-center pt-[50px]">
            <Text className="text-[45px]">🛒</Text>

            <Text className="text-white text-[17px] font-black mt-[10px]">
              NOTHING HERE
            </Text>

            <Text className="text-[#555555] text-[11px] mt-[5px]">
              Add your first item.
            </Text>
          </View>
        }
      />

      {/* ------------------------------------------------
          ADD ITEM MODAL
      ------------------------------------------------ */}

      <AddItemModal
        visible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSave={(newItem) => {
          console.log("NEW ITEM:", newItem);

          addItem(newItem);
        }}
      />

      <AddItemModal
  visible={showEditItemModal}
  editingItem={editingItem}
  onClose={() => {
    setShowEditItemModal(false);
    setEditingItem(null);
  }}
  onSave={(updatedItem) => {
    updateItem(updatedItem.id, {
      name: updatedItem.name,
      price: updatedItem.price,
      quantity: updatedItem.quantity,
      category: updatedItem.category,
    });

    setShowEditItemModal(false);
    setEditingItem(null);
  }}
/>
    </View>
  );
};

export default ListDetailScreen;
