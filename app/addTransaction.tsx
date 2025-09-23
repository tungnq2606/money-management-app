import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionForm from "../components/TransactionForm";

const AddTransactionScreen = () => {
  const { type } = useLocalSearchParams<{ type: "income" | "expense" }>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [wallet, setWallet] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const isIncome = type === "income";
  const headerColor = isIncome ? "#00A86B" : "#FD3C4A";
  const buttonColor = isIncome ? "#00A86B" : "#FD3C4A";

  const handleSave = () => {
    if (!amount || !description || !category || !wallet) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Here you would typically save to your database
    console.log({
      type,
      amount: parseFloat(amount),
      description,
      category,
      wallet,
      imageUri,
      timestamp: new Date().toISOString(),
    });

    Alert.alert(
      "Success",
      `${isIncome ? "Income" : "Expense"} added successfully!`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: headerColor }]}
        edges={["top"]}
      >
        {/* Header and Amount Section with colored background */}
        <View style={[styles.topSection, { backgroundColor: headerColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isIncome ? "Income" : "Expense"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Amount Section */}
          <View style={styles.amountSection}>
            <Text style={styles.label}>How much?</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
              />
            </View>
          </View>
        </View>

        {/* Form */}
        <TransactionForm
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
          wallet={wallet}
          setWallet={setWallet}
          imageUri={imageUri}
          setImageUri={setImageUri}
          isIncome={isIncome}
          buttonColor={buttonColor}
          onSave={handleSave}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  amountSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
});

export default AddTransactionScreen;
