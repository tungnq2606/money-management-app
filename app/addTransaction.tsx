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
  getGlobalBudgetService,
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
  const [budgetInfo, setBudgetInfo] = useState<{
    budgetName: string;
    remain: number;
    isOverBudget: boolean;
  } | null>(null);

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

  // Check budget when category and wallet are selected (for expenses only)
  useEffect(() => {
    if (!isIncome || !categoryId || !walletId || !user) {
      setBudgetInfo(null);
      return;
    }

    try {
      const budgetService = getGlobalBudgetService();
      const candidateBudgets = budgetService.getBudgetsByCategoryId(categoryId);
      const currentDate = new Date();

      const matchingBudget = candidateBudgets.find((b) => {
        const walletMatches = Array.isArray(b.walletId)
          ? b.walletId.includes(walletId)
          : false;
        const inRange = currentDate >= b.fromDate && currentDate <= b.toDate;
        return walletMatches && inRange;
      });

      if (matchingBudget) {
        setBudgetInfo({
          budgetName: matchingBudget.name,
          remain: matchingBudget.remain || 0,
          isOverBudget: (matchingBudget.remain || 0) <= 0,
        });
      } else {
        setBudgetInfo(null);
      }
    } catch (error) {
      console.error("Error checking budget:", error);
      setBudgetInfo(null);
    }
  }, [categoryId, walletId, isIncome, user]);

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
        let message = `${isIncome ? "Income" : "Expense"} has been added!`;

        // Add budget information for expenses
        if (!isIncome && budgetInfo) {
          const newRemain = Math.max(0, budgetInfo.remain - parsedAmount);
          const isOverBudget = newRemain === 0 && budgetInfo.remain > 0;
          const status = isOverBudget ? " (OVER BUDGET!)" : "";
          message += `\n\nBudget "${
            budgetInfo.budgetName
          }" remaining: $${formatNumber(newRemain)}${status}`;
        }

        Alert.alert("Success", message, [
          { text: "OK", onPress: () => router.back() },
        ]);
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

        {/* Budget Info Display */}
        {budgetInfo && (
          <View style={styles.budgetInfoContainer}>
            <View style={styles.budgetInfoHeader}>
              <Text style={styles.budgetInfoTitle}>Budget Information</Text>
            </View>
            <View style={styles.budgetInfoContent}>
              <Text style={styles.budgetName}>{budgetInfo.budgetName}</Text>
              <View style={styles.budgetRemainContainer}>
                <Text style={styles.budgetRemainLabel}>Remaining:</Text>
                <Text
                  style={[
                    styles.budgetRemainAmount,
                    budgetInfo.isOverBudget && styles.overBudgetText,
                  ]}
                >
                  ${formatNumber(budgetInfo.remain)}
                </Text>
              </View>
              {budgetInfo.isOverBudget && (
                <Text style={styles.overBudgetWarning}>
                  ⚠️ This budget is already exceeded!
                </Text>
              )}
            </View>
          </View>
        )}

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
  budgetInfoContainer: {
    backgroundColor: "#F8F9FA",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  budgetInfoHeader: {
    backgroundColor: "#E9ECEF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  budgetInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  budgetInfoContent: {
    padding: 16,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  budgetRemainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  budgetRemainLabel: {
    fontSize: 16,
    color: "#6C757D",
  },
  budgetRemainAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28A745",
  },
  overBudgetText: {
    color: "#DC3545",
  },
  overBudgetWarning: {
    fontSize: 14,
    color: "#DC3545",
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "#F8D7DA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F5C6CB",
  },
});

export default AddTransactionScreen;
