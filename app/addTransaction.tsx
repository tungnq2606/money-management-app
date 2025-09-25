import { formatNumber } from "@/constants/formatMoney";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import {
  getGlobalCategoryService,
  getGlobalWalletService,
} from "../database/services";
import { useAuthStore } from "../stores/authStore";
import { useTransactionStore } from "../stores/transactionStore";

const AddTransactionScreen = () => {
  const { type } = useLocalSearchParams<{ type: "income" | "expense" }>();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const user = useAuthStore((s) => s.user);
  const createTransaction = useTransactionStore((s) => s.createTransaction);
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [walletOptions, setWalletOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const isIncome = type === "income";
  const headerColor = isIncome ? "#00A86B" : "#FD3C4A";
  const buttonColor = isIncome ? "#00A86B" : "#FD3C4A";

  useEffect(() => {
    if (!user) return;
    // Load categories by user and type
    const categories = getGlobalCategoryService()
      .getCategoriesByType(user._id.toString(), isIncome ? "income" : "expense")
      .map((c) => ({ id: c._id.toString(), name: c.name }));
    setCategoryOptions(categories);

    const wallets = getGlobalWalletService()
      .getWalletsByUserId(user._id.toString())
      .map((w) => ({ id: w._id.toString(), name: w.name }));
    setWalletOptions(wallets);

    // Preselect first options if available
    if (!categoryId && categories.length > 0) setCategoryId(categories[0].id);
    if (!walletId && wallets.length > 0) setWalletId(wallets[0].id);
  }, [user, isIncome, categoryId, walletId]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You need to log in to add a transaction");
      return;
    }

    if (!amount || !note || !categoryId || !walletId) {
      Alert.alert("Error", "Please fill in all information");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Invalid amount");
      return;
    }

    try {
      const ok = await createTransaction({
        walletId,
        categoryId,
        amount: parsedAmount,
        type: isIncome ? "income" : "expense",
        note: note,
        date: selectedDate,
      });

      if (ok) {
        Alert.alert(
          "Success",
          `${isIncome ? "Income" : "Expense"} has been added!`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", "Unable to create transaction");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "An error occurred while creating the transaction");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  console.log(amount);
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
                value={formatNumber(Number(amount || 0))}
                onChangeText={(text) => {
                  const digits = text.replace(/[^\d]/g, "");
                  setAmount(digits);
                }}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
              />
            </View>
          </View>
        </View>

        {/* Form */}
        <TransactionForm
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          note={note}
          setNote={setNote}
          walletId={walletId}
          setWalletId={setWalletId}
          imageUri={imageUri}
          setImageUri={setImageUri}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isIncome={isIncome}
          buttonColor={buttonColor}
          onSave={handleSave}
          categoryOptions={categoryOptions}
          walletOptions={walletOptions}
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
