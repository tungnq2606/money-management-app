import { AccountData, useAccountStore } from "@/stores/accountStore";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountsScreen() {
  const { user } = useAuthStore();
  const { accounts, isLoading, fetchAccounts, createAccount } =
    useAccountStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "checking",
    balance: "0",
    currency: "USD",
  });

  useEffect(() => {
    if (user) {
      fetchAccounts(user.id);
    }
  }, [user, fetchAccounts]);

  const handleRefresh = async () => {
    if (!user) return;
    setIsRefreshing(true);
    await fetchAccounts(user.id);
    setIsRefreshing(false);
  };

  const handleCreateAccount = async () => {
    if (!user || !newAccount.name.trim()) {
      Alert.alert("Error", "Please enter an account name");
      return;
    }

    const balance = parseFloat(newAccount.balance) || 0;
    const success = await createAccount(
      user.id,
      newAccount.name.trim(),
      newAccount.type,
      balance,
      newAccount.currency
    );

    if (success) {
      setShowCreateModal(false);
      setNewAccount({
        name: "",
        type: "checking",
        balance: "0",
        currency: "USD",
      });
    } else {
      Alert.alert("Error", "Failed to create account");
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const renderAccount = (account: AccountData) => (
    <View key={account._id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountType}>{account.type.toUpperCase()}</Text>
      </View>
      <Text style={styles.accountBalance}>
        {formatCurrency(account.balance, account.currency)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && accounts.length === 0 ? (
          <Text style={styles.loadingText}>Loading accounts...</Text>
        ) : accounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Accounts Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first account to start managing your finances
            </Text>
          </View>
        ) : (
          accounts.map(renderAccount)
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.modalBackButton}
            >
              <Text style={styles.modalBackButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Account</Text>
            <TouchableOpacity
              onPress={handleCreateAccount}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Name</Text>
              <TextInput
                style={styles.textInput}
                value={newAccount.name}
                onChangeText={(text) =>
                  setNewAccount({ ...newAccount, name: text })
                }
                placeholder="e.g., Main Checking"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Type</Text>
              <View style={styles.typeButtons}>
                {["checking", "savings", "credit", "cash", "investment"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newAccount.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setNewAccount({ ...newAccount, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newAccount.type === type &&
                            styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Initial Balance</Text>
              <TextInput
                style={styles.textInput}
                value={newAccount.balance}
                onChangeText={(text) =>
                  setNewAccount({ ...newAccount, balance: text })
                }
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accountName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  accountType: {
    fontSize: 12,
    fontWeight: "500",
    color: "#007AFF",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalHeader: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBackButton: {
    paddingVertical: 8,
  },
  modalBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSaveButton: {
    paddingVertical: 8,
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
});
