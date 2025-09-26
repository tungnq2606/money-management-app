import MonthSelector from "@/components/MonthSelector";
import SpendFrequencyChart from "@/components/SpendFrequencyChart";
import TransactionItem from "@/components/TransactionItem";
import { formatMoney } from "@/constants/formatMoney";
import { getGlobalCategoryService } from "@/database/services";
import { useAuthStore } from "@/stores/authStore";
import { useBudgetStore } from "@/stores/budgetStore";
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
  const { budgets, loadBudgetsByUserIdWithSpending } = useBudgetStore();

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const handleMonthChange = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex);
  }, []);

  // Period selection for chart and transaction filtering
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Today");

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();

    switch (selectedPeriod) {
      case "Today": {
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
        return { startDate: start, endDate: end };
      }
      case "Week": {
        // Last 7 days ending today
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end };
      }
      case "Year": {
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { startDate: start, endDate: end };
      }
      default: // Month
        const year = now.getFullYear();
        const start = new Date(year, selectedMonth, 1, 0, 0, 0, 0);
        const end = new Date(year, selectedMonth + 1, 0, 23, 59, 59, 999);
        return { startDate: start, endDate: end };
    }
  }, [selectedPeriod, selectedMonth]);

  useEffect(() => {
    if (!user) return;
    loadWallets(user._id.toString());
    loadBudgetsByUserIdWithSpending(user._id.toString());
  }, [user, loadWallets, loadBudgetsByUserIdWithSpending]);

  useEffect(() => {
    if (!user || wallets.length === 0) return;
    const walletIds = wallets.map((w) => w._id.toString());
    loadTransactionsWithFilters({ walletIds, startDate, endDate });
  }, [
    user,
    wallets,
    startDate,
    endDate,
    selectedPeriod,
    loadTransactionsWithFilters,
  ]);

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
    // Limit chart data to top 50 latest transactions for performance
    if (transactions.length === 0) {
      return [{ value: 0 }]; // Provide default data point when no transactions
    }

    // Take only the first 50 transactions (already sorted by date, newest first)
    const limitedTransactions = transactions.slice(0, 50);

    const data = limitedTransactions.map((t) => ({
      value: t.type === "income" ? t.amount : -t.amount,
    }));

    console.log(`Chart data for ${selectedPeriod}:`, {
      totalTransactions: transactions.length,
      displayedTransactions: limitedTransactions.length,
      dataPoints: data.length,
      sampleValues: data.slice(0, 5).map((d) => d.value),
    });

    return data;
  }, [transactions, selectedPeriod]);

  console.log(chartData);
  const recentTransactions = useMemo(() => {
    const categoryService = getGlobalCategoryService();
    // Show all transactions for the selected period (limited to first 20 for performance)
    return transactions.slice(0, 20).map((t) => {
      const category = categoryService.getCategoryById(t.categoryId);
      const isIncome = t.type === "income";
      const icon = isIncome ? "creditcard" : "shoppingcart";
      const color = isIncome ? "#B7F4C3" : "#FDC65C";
      const time = new Date(t.date).toLocaleTimeString([], {
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

  // Budget summary
  const budgetSummary = useMemo(() => {
    if (budgets.length === 0) return null;

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => {
      const spent = Math.max(0, budget.amount - budget.remain);
      return sum + spent;
    }, 0);
    const totalRemaining = budgets.reduce(
      (sum, budget) => sum + budget.remain,
      0
    );
    const exceededBudgets = budgets.filter(
      (budget) => budget.remain <= 0
    ).length;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      exceededBudgets,
      budgetCount: budgets.length,
    };
  }, [budgets]);

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

          {selectedPeriod === "Month" && (
            <MonthSelector onMonthChange={(idx) => handleMonthChange(idx)} />
          )}

          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications" size={24} color="#7F3DFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.accountBalanceTitle}>Account Balance</Text>
        <Text style={styles.balanceAmount}>{formatMoney(totalAmount)}</Text>
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
              <Text style={styles.accountBoxText}>Income</Text>
              <Text style={styles.accountBoxAmount}>
                {formatMoney(incomeTotal)}
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
              <Text style={styles.accountBoxText}>Expense</Text>
              <Text style={styles.accountBoxAmount}>
                {formatMoney(expenseTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Budget Summary */}
        {budgetSummary && (
          <View style={styles.budgetSummary}>
            <View style={styles.budgetSummaryHeader}>
              <Text style={styles.budgetSummaryTitle}>Budget Overview</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/budget")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.budgetStats}>
              <View style={styles.budgetStatItem}>
                <Text style={styles.budgetStatLabel}>Total Budget</Text>
                <Text style={styles.budgetStatValue}>
                  {formatMoney(budgetSummary.totalBudget)}
                </Text>
              </View>
              <View style={styles.budgetStatItem}>
                <Text style={styles.budgetStatLabel}>Spent</Text>
                <Text style={[styles.budgetStatValue, { color: "#FF4D4F" }]}>
                  {formatMoney(budgetSummary.totalSpent)}
                </Text>
              </View>
              <View style={styles.budgetStatItem}>
                <Text style={styles.budgetStatLabel}>Remaining</Text>
                <Text style={[styles.budgetStatValue, { color: "#22C55E" }]}>
                  {formatMoney(budgetSummary.totalRemaining)}
                </Text>
              </View>
            </View>
            {budgetSummary.exceededBudgets > 0 && (
              <View style={styles.budgetWarning}>
                <AntDesign name="warning" size={16} color="#FF4D4F" />
                <Text style={styles.budgetWarningText}>
                  {budgetSummary.exceededBudgets} budget(s) exceeded
                </Text>
              </View>
            )}
          </View>
        )}

        <SpendFrequencyChart
          key={`chart-${selectedPeriod}-${transactions.length}`}
          data={chartData}
          selectedPeriod={selectedPeriod}
          onChangePeriod={setSelectedPeriod}
        />
        <View style={styles.recentTransactionsHeader}>
          <Text style={styles.recentTransactionsTitle}>
            {selectedPeriod === "Today"
              ? "Today's Transactions"
              : selectedPeriod === "Week"
              ? "This Week's Transactions"
              : selectedPeriod === "Year"
              ? "This Year's Transactions"
              : "This Month's Transactions"}
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
  budgetSummary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  budgetSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetSummaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  budgetStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetStatItem: {
    flex: 1,
    alignItems: "center",
  },
  budgetStatLabel: {
    fontSize: 12,
    color: "#91919F",
    marginBottom: 4,
  },
  budgetStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  budgetWarning: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#FFF2F2",
    borderRadius: 8,
  },
  budgetWarningText: {
    fontSize: 12,
    color: "#FF4D4F",
    marginLeft: 8,
  },
  accountBoxContent: {
    marginLeft: 8,
    flex: 1,
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
