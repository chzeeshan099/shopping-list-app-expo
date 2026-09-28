import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { name: "Food", icon: "🍔" },
  { name: "Drinks", icon: "🥤" },
  { name: "Home", icon: "🏠" },
  { name: "Personal", icon: "👤" },
  { name: "Gaming", icon: "🎮" },
  { name: "Other", icon: "📦" },
];

export default function AddItemModal({
  visible,
  onClose,
  onSave,
  editingItem = null,
}) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (visible) {
    setError("");

    if (editingItem) {
      setItemName(editingItem.name || "");
      setPrice(String(editingItem.price ?? ""));
      setQuantity(String(editingItem.quantity ?? "1"));
      setCategory(editingItem.category || "");
    } else {
      setItemName("");
      setPrice("");
      setQuantity("1");
      setCategory("");
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [visible, editingItem]);

  const resetForm = () => {
    setItemName("");
    setPrice("");
    setQuantity("1");
    setCategory("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    const cleanName = itemName.trim();
    const cleanPrice = price.trim();
    const cleanQuantity = quantity.trim();

    if (!cleanName) {
      setError("Item name is required");
      return;
    }

    if (!cleanPrice) {
      setError("Price is required");
      return;
    }

    if (isNaN(Number(cleanPrice)) || Number(cleanPrice) < 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!cleanQuantity) {
      setError("Quantity is required");
      return;
    }

    if (
      isNaN(Number(cleanQuantity)) ||
      Number(cleanQuantity) <= 0
    ) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

   const itemData = {
  ...(editingItem || {}),

  name: cleanName,
  price: Number(cleanPrice),
  quantity: Number(cleanQuantity),
  category,
};

onSave(itemData);

resetForm();
onClose();

 
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{editingItem ? "EDIT ITEM" : "ADD ITEM"}</Text>
              <Text style={styles.subtitle}>
                {editingItem ? "EDIT " : "ADD "} something to your shopping list
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Item Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                ITEM NAME <Text style={styles.required}>*</Text>
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="pricetag-outline"
                  size={21}
                  color="#9CFF00"
                />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Gaming Mouse"
                  placeholderTextColor="#666666"
                  value={itemName}
                  onChangeText={(text) => {
                    setItemName(text);
                    setError("");
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Price + Quantity */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>
                  PRICE <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.currency}>$</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#666666"
                    value={price}
                    onChangeText={(text) => {
                      setPrice(text);
                      setError("");
                    }}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>
                  QUANTITY <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="layers-outline"
                    size={20}
                    color="#9CFF00"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    placeholderTextColor="#666666"
                    value={quantity}
                    onChangeText={(text) => {
                      setQuantity(text);
                      setError("");
                    }}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>

            {/* Category */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                CATEGORY <Text style={styles.required}>*</Text>
              </Text>

              <View style={styles.categories}>
                {CATEGORIES.map((item) => {
                  const selected = category === item.name;

                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.categoryButton,
                        selected && styles.categorySelected,
                      ]}
                      onPress={() => {
                        setCategory(item.name);
                        setError("");
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.categoryIcon}>
                        {item.icon}
                      </Text>

                      <Text
                        style={[
                          styles.categoryText,
                          selected &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>

                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={17}
                          color="#0A0A0A"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color="#FF4D4D"
                />

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Save */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={23}
                color="#050505"
              />

              <Text style={styles.saveText}>
               {editingItem ? "SAVE CHANGES" : "SAVE ITEM"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.requiredHint}>
              * All fields are required
            </Text>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.78)",
  },

  modalContainer: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: "#292929",
    maxHeight: "88%",
    paddingTop: 22,
    shadowColor: "#9CFF00",
    shadowOpacity: 0.18,
    shadowRadius: 25,
    elevation: 20,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    marginBottom: 22,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  subtitle: {
    color: "#777777",
    fontSize: 12,
    marginTop: 5,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#1D1D1D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#303030",
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    color: "#A7A7A7",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  required: {
    color: "#9CFF00",
  },

  inputWrapper: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#303030",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 11,
  },

  currency: {
    color: "#9CFF00",
    fontSize: 21,
    fontWeight: "900",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  halfField: {
    flex: 1,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  categoryButton: {
    minHeight: 44,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#303030",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  categorySelected: {
    backgroundColor: "#9CFF00",
    borderColor: "#9CFF00",
  },

  categoryIcon: {
    fontSize: 17,
  },

  categoryText: {
    color: "#AAAAAA",
    fontSize: 13,
    fontWeight: "700",
  },

  categoryTextSelected: {
    color: "#080808",
    fontWeight: "900",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241414",
    borderWidth: 1,
    borderColor: "#542222",
    borderRadius: 13,
    padding: 12,
    marginBottom: 15,
    gap: 8,
  },

  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  saveButton: {
    height: 58,
    backgroundColor: "#9CFF00",
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 3,
  },

  saveText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  requiredHint: {
    color: "#555555",
    textAlign: "center",
    fontSize: 11,
    marginTop: 12,
  },
});