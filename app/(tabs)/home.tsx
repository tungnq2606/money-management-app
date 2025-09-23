import MonthSelector from "@/components/MonthSelector";
import SpendFrequencyChart from "@/components/SpendFrequencyChart";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HomeScreen = () => {
  const handleMonthChange = (monthIndex: number, monthName: string) => {
    console.log(`Selected month: ${monthName} (index: ${monthIndex})`);
    // Handle month change logic here
  };

  // Sample data for the line chart
  const chartData = [
    { value: 500 },
    { value: 800 },
    { value: 600 },
    { value: 1200 },
    { value: 900 },
    { value: 1500 },
    { value: 1100 },
    { value: 1800 },
    { value: 1300 },
    { value: 2000 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={24} color="white" />
          </View>

          <MonthSelector onMonthChange={handleMonthChange} />

          <Ionicons name="notifications" size={24} color="#7F3DFF" />
        </View>
        <Text style={styles.accountBalanceTitle}>Account Balance</Text>
        <Text style={styles.balanceAmount}>$9400</Text>
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
              <Text style={styles.accountBoxAmount}>$500</Text>
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
              <Text style={styles.accountBoxAmount}>$500</Text>
            </View>
          </View>
        </View>
        <SpendFrequencyChart data={chartData} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
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
});
