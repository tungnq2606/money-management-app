import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QuickStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  accountsCount: number;
}

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();
  const [stats, setStats] = useState<QuickStats>({
    totalBalance: 1250.75,
    monthlyIncome: 3500.0,
    monthlyExpenses: 2100.25,
    accountsCount: 3,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const quickActions = [
    {
      title: "Add Transaction",
      subtitle: "Record income or expense",
      color: "#4CAF50",
      onPress: () => router.push("/(authenticated)/transactions"),
    },
    {
      title: "View Accounts",
      subtitle: "Manage your accounts",
      color: "#2196F3",
      onPress: () => router.push("/(authenticated)/accounts"),
    },
    {
      title: "Set Budget",
      subtitle: "Create spending limits",
      color: "#FF9800",
      onPress: () => router.push("/(authenticated)/budgets"),
    },
    {
      title: "Profile",
      subtitle: "Account settings",
      color: "#9C27B0",
      onPress: () => router.push("/(authenticated)/profile"),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || "User"}!</Text>
          <Text style={styles.subGreeting}>Manage your finances</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Overview */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(stats.totalBalance)}
        </Text>

        <View style={styles.monthlyStatsRow}>
          <View style={styles.monthlyStat}>
            <Text style={styles.monthlyStatLabel}>This Month Income</Text>
            <Text style={[styles.monthlyStatAmount, { color: "#4CAF50" }]}>
              {formatCurrency(stats.monthlyIncome)}
            </Text>
          </View>
          <View style={styles.monthlyStat}>
            <Text style={styles.monthlyStatLabel}>This Month Expenses</Text>
            <Text style={[styles.monthlyStatAmount, { color: "#F44336" }]}>
              {formatCurrency(stats.monthlyExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickActionCard,
                { borderLeftColor: action.color },
              ]}
              onPress={action.onPress}
            >
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Active Accounts</Text>
            <Text style={styles.summaryValue}>{stats.accountsCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Income (This Month)</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    stats.monthlyIncome - stats.monthlyExpenses >= 0
                      ? "#4CAF50"
                      : "#F44336",
                },
              ]}
            >
              {formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 16,
    color: "#B3D9FF",
    marginTop: 4,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
  },
  balanceCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  monthlyStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthlyStat: {
    flex: 1,
  },
  monthlyStatLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  monthlyStatAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
