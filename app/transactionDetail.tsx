import HeaderApp from "@/components/HeaderApp";
import { formatMoney } from "@/constants/formatMoney";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getGlobalCategoryService,
  getGlobalTransactionService,
  getGlobalWalletService,
} from "../database/services";
import { useTransactionStore } from "../stores/transactionStore";

const TransactionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [walletName, setWalletName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const { deleteTransaction } = useTransactionStore();

  const loadTransactionDetail = useCallback(async () => {
    // Don't load if transaction is already deleted
    if (isDeleted) return;

    try {
      setIsLoading(true);

      // Load transaction
      const transactionData =
        getGlobalTransactionService().getTransactionById(id);
      if (!transactionData) {
        Alert.alert("Error", "Transaction not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      setTransaction(transactionData);

      // Load category name
      const category = getGlobalCategoryService().getCategoryById(
        transactionData.categoryId
      );
      setCategoryName(category?.name || "Unknown Category");

      // Load wallet name
      const wallet = getGlobalWalletService().getWalletById(
        transactionData.walletId
      );
      setWalletName(wallet?.name || "Unknown Wallet");
    } catch (error) {
      console.error("Error loading transaction detail:", error);
      Alert.alert("Error", "Failed to load transaction details");
    } finally {
      setIsLoading(false);
    }
  }, [id, isDeleted]);

  const handleEdit = () => {
    router.push(`/editTransaction?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteTransaction(id);
              if (success) {
                setIsDeleted(true);
                router.back();
              } else {
                Alert.alert("Error", "Failed to delete transaction");
              }
            } catch (error) {
              console.error("Delete transaction error:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the transaction"
              );
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Transaction ID not found", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    loadTransactionDetail();
  }, [id, loadTransactionDetail]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isDeleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction has been deleted</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === "income";
  const amountColor = isIncome ? "#00A86B" : "#FD3C4A";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <HeaderApp
        title={"Transaction Details"}
        isBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleDelete} hitSlop={8}>
            <Ionicons name="trash-bin-sharp" size={24} color="black" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>
            {isIncome ? "Income Amount" : "Expense Amount"}
          </Text>
          <Text style={[styles.amountValue, { color: amountColor }]}>
            {isIncome ? "+" : "-"} {formatMoney(transaction.amount)}
          </Text>
        </View>

        {/* Transaction Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type</Text>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: isIncome ? "#E8F5E8" : "#FFE8E8" },
              ]}
            >
              <Text style={[styles.typeText, { color: amountColor }]}>
                {isIncome ? "Income" : "Expense"}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{categoryName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Wallet</Text>
            <Text style={styles.infoValue}>{walletName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(transaction.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>
              {new Date(transaction.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {transaction.note && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Note</Text>
              <Text style={styles.infoValue}>{transaction.note}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {transaction.updatedAt &&
            transaction.updatedAt !== transaction.createdAt && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>
                  {new Date(transaction.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <AntDesign name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit Transaction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  amountSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FA",
  },
  amountLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionSection: {
    padding: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#007AFF",
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransactionDetailScreen;
