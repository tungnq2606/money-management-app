import MonthSelector from "@/components/MonthSelector";
import SpendFrequencyChart from "@/components/SpendFrequencyChart";
import TransactionItem from "@/components/TransactionItem";
import { getGlobalCategoryService } from "@/database/services";
import { useAuthStore } from "@/stores/authStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useWalletStore } from "@/stores/walletStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen = () => {
  const { user } = useAuthStore();
  const { wallets, loadWallets, totalAmount } = useWalletStore();
  const { transactions, loadTransactionsWithFilters } = useTransactionStore();

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const handleMonthChange = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex);
  }, []);

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, selectedMonth, 1, 0, 0, 0, 0);
    const end = new Date(year, selectedMonth + 1, 0, 23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }, [selectedMonth]);

  useEffect(() => {
    if (!user) return;
    loadWallets(user._id.toString());
  }, [user, loadWallets]);

  useEffect(() => {
    if (!user || wallets.length === 0) return;
    const walletIds = wallets.map((w) => w._id.toString());
    loadTransactionsWithFilters({ walletIds, startDate, endDate });
  }, [user, wallets, startDate, endDate, loadTransactionsWithFilters]);

  const { incomeTotal, expenseTotal } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { incomeTotal: income, expenseTotal: expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Build daily expense totals for the selected month
    const daysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    ).getDate();
    const daily: number[] = Array.from({ length: daysInMonth }, () => 0);
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const d = t.createdAt;
      if (d >= startDate && d <= endDate) {
        const dayIndex = d.getDate() - 1;
        daily[dayIndex] += t.amount;
      }
    });
    return daily.map((value) => ({ value }));
  }, [transactions, startDate, endDate]);

  const recentTransactions = useMemo(() => {
    const categoryService = getGlobalCategoryService();
    return transactions.slice(0, 10).map((t) => {
      const category = categoryService.getCategoryById(t.categoryId);
      const isIncome = t.type === "income";
      const icon = isIncome ? "creditcard" : "shoppingcart";
      const color = isIncome ? "#B7F4C3" : "#FDC65C";
      const time = new Date(t.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        id: t._id.toString(),
        type: category?.name || (isIncome ? "Income" : "Expense"),
        description: t.note || "",
        amount: isIncome ? t.amount : -t.amount,
        time,
        icon,
        color,
      };
    });
  }, [transactions]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={24} color="white" />
          </View>

          <MonthSelector onMonthChange={(idx) => handleMonthChange(idx)} />

          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications" size={24} color="#7F3DFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.accountBalanceTitle}>Account Balance</Text>
        <Text style={styles.balanceAmount}>
          ${totalAmount.toLocaleString()}
        </Text>
        <View style={styles.accountInfo}>
          <View style={[styles.accountBox, styles.incomeBox]}>
            <View style={styles.accountIconContainer}>
              <Image
                source={require("../../assets/images/income_color.png")}
                style={styles.accountIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.accountBoxContent}>
              <Text style={styles.accountBoxText}>Expense</Text>
              <Text style={styles.accountBoxAmount}>
                ${expenseTotal.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={[styles.accountBox, styles.expenseBox]}>
            <View style={styles.accountIconContainer}>
              <Image
                source={require("../../assets/images/expense_color.png")}
                style={styles.accountIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.accountBoxContent}>
              <Text style={styles.accountBoxText}>Income</Text>
              <Text style={styles.accountBoxAmount}>
                ${incomeTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        <SpendFrequencyChart data={chartData} />
        <View style={styles.recentTransactionsHeader}>
          <Text style={styles.recentTransactionsTitle}>
            Recent Transactions
          </Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View>
          {recentTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              id={transaction.id}
              type={transaction.type}
              description={transaction.description}
              amount={transaction.amount}
              time={transaction.time}
              icon={transaction.icon}
              color={transaction.color}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  accountBalanceTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#91919F",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
    marginTop: 8,
  },
  accountInfo: {
    flexDirection: "row",
    marginVertical: 24,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  accountBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    flexDirection: "row",
  },
  expenseBox: {
    backgroundColor: "#FD3C4A",
  },
  incomeBox: {
    backgroundColor: "#00A86B",
  },
  accountBoxText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  accountBoxAmount: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    color: "#fff",
  },
  accountIconContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  accountIcon: {
    width: 24,
    height: 24,
  },
  accountBoxContent: {
    marginLeft: 8,
  },
  recentTransactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 24,
    marginBottom: 16,
  },
  recentTransactionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  viewAllButton: {
    backgroundColor: "rgba(127, 61, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7F3DFF",
  },
});
