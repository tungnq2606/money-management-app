import { Wallet } from "@/database/schemas/Wallet";
import { useAuthStore } from "@/stores/authStore";
import { useWalletStore } from "@/stores/walletStore";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen = () => {
  const { user } = useAuthStore();
  const { wallets, loadWallets, isLoading } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await loadWallets(user._id.toString());
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWallets(user._id.toString());
    }
  }, [user, loadWallets]);

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + wallet.amount, 0);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || "User"}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          $
          {getTotalBalance().toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Wallets</Text>
          <Text style={styles.walletCount}>({wallets.length})</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading wallets...</Text>
          </View>
        ) : wallets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No wallets found</Text>
            <Text style={styles.emptySubText}>
              Create your first wallet to get started
            </Text>
          </View>
        ) : (
          wallets.map((wallet: Wallet) => (
            <TouchableOpacity
              key={wallet._id.toString()}
              style={styles.walletCard}
            >
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{wallet.name}</Text>
                <Text style={styles.walletType}>{wallet.type}</Text>
              </View>
              <Text style={styles.walletAmount}>
                $
                {wallet.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Create Budget</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#B3D9FF",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  walletCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  walletCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  walletType: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  quickActions: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    padding: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
