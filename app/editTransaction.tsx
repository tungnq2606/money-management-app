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
  getGlobalTransactionService,
  getGlobalWalletService,
} from "../database/services";
import { useAuthStore } from "../stores/authStore";
import { useTransactionStore } from "../stores/transactionStore";

const EditTransactionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((s) => s.user);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [walletOptions, setWalletOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const isIncome = transactionType === "income";
  const headerColor = isIncome ? "#00A86B" : "#FD3C4A";
  const buttonColor = isIncome ? "#00A86B" : "#FD3C4A";

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Transaction ID not found", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    loadTransactionData();
  }, [id]);

  useEffect(() => {
    if (user && transactionType) {
      // Reload categories when transaction type changes
      const categories = getGlobalCategoryService()
        .getCategoriesByType(user._id.toString(), transactionType)
        .map((c) => ({ id: c._id.toString(), name: c.name }));
      setCategoryOptions(categories);

      // Reset category selection if current category is not available for new type
      if (categoryId && !categories.find((c) => c.id === categoryId)) {
        setCategoryId(categories.length > 0 ? categories[0].id : "");
      }
    }
  }, [user, transactionType, categoryId]);

  const loadTransactionData = async () => {
    try {
      setIsLoading(true);

      // Load transaction data
      const transaction = getGlobalTransactionService().getTransactionById(id);
      if (!transaction) {
        Alert.alert("Error", "Transaction not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      // Set transaction data
      setAmount(transaction.amount.toString());
      setNote(transaction.note || "");
      setCategoryId(transaction.categoryId);
      setWalletId(transaction.walletId);
      setSelectedDate(new Date(transaction.date));
      setTransactionType(transaction.type);

      // Load categories and wallets
      if (user) {
        const categories = getGlobalCategoryService()
          .getCategoriesByType(user._id.toString(), transaction.type)
          .map((c) => ({ id: c._id.toString(), name: c.name }));
        setCategoryOptions(categories);

        const wallets = getGlobalWalletService()
          .getWalletsByUserId(user._id.toString())
          .map((w) => ({ id: w._id.toString(), name: w.name }));
        setWalletOptions(wallets);
      }
    } catch (error) {
      console.error("Error loading transaction data:", error);
      Alert.alert("Error", "Failed to load transaction data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You need to log in to edit a transaction");
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
      const success = await updateTransaction(id, {
        walletId,
        categoryId,
        amount: parsedAmount,
        type: transactionType,
        note: note,
        date: selectedDate,
      });

      if (success) {
        Alert.alert("Success", `Transaction has been updated successfully!`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Unable to update transaction");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "An error occurred while updating the transaction");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Edit Transaction</Text>
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
          isEditMode={true}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default EditTransactionScreen;
