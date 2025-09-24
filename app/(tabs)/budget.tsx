import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney, formatNumber } from "../../constants/formatMoney";

export default function BudgetListScreen() {
  // Temporary mock data for the list UI
  const budgets = React.useMemo(
    () => [
      {
        id: "shopping",
        name: "Shopping",
        color: "#FDBC10",
        spent: 1200,
        limit: 1000,
      },
      {
        id: "transportation",
        name: "Transportation",
        color: "#4D7CFE",
        spent: 350,
        limit: 700,
      },
      {
        id: "food",
        name: "Food & Drink",
        color: "#7F3DFF",
        spent: 520,
        limit: 800,
      },
    ],
    []
  );

  const months = React.useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );
  const [monthIndex, setMonthIndex] = React.useState(new Date().getMonth());

  const goPrev = () =>
    setMonthIndex((m) => (m - 1 + months.length) % months.length);
  const goNext = () => setMonthIndex((m) => (m + 1) % months.length);

  const Header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={goPrev} hitSlop={8}>
        <AntDesign name="left" size={18} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{months[monthIndex]}</Text>
      <TouchableOpacity onPress={goNext} hitSlop={8}>
        <AntDesign name="right" size={18} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => {
    const percentage = Math.min(1, item.spent / item.limit);
    const exceeded = item.spent >= item.limit;
    const remaining = Math.max(0, item.limit - item.spent);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/budgetDetail",
            params: {
              id: item.id,
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.tag}>
            <View style={[styles.tagDot, { backgroundColor: item.color }]} />
            <Text style={styles.tagText}>{item.name}</Text>
          </View>
          {exceeded ? (
            <View style={styles.alertDot}>
              <AntDesign name="info" size={16} color="white" />
            </View>
          ) : (
            <View style={{ width: 16 }} />
          )}
        </View>

        <Text style={styles.remainingTitle}>
          Remaining {formatMoney(remaining)}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage * 100}%`, backgroundColor: item.color },
            ]}
          />
        </View>

        <Text style={styles.subAmount}>
          {`$${formatNumber(item.spent)} of $${formatNumber(item.limit)}`}
        </Text>

        {exceeded && (
          <Text style={styles.warningText}>You’ve exceed the limit!</Text>
        )}
      </TouchableOpacity>
    );
  };

  const Body = (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      {budgets.length === 0 ? (
        <View style={styles.emptyBody}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.emptyText}>
              You don’t have a budget.{"\n"} Let’s make one so you in control.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push("/budgetForm")}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>Create a budget</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>{Header}</View>
      <View style={styles.contentContainer}>{Body}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#7F3DFF",
    flex: 1,
  },
  headerContainer: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    width: "100%",
  },
  headerTitle: { color: "white", fontWeight: "500", fontSize: 24 },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  tagText: {
    color: "#333",
  },
  alertDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF4D4F",
    justifyContent: "center",
    alignItems: "center",
  },
  remainingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#EEF0F6",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
  },
  subAmount: {
    color: "#9A9AA1",
    marginTop: 8,
  },
  warningText: {
    color: "#FF4D4F",
    marginTop: 6,
  },
  emptyBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: { textAlign: "center", color: "#9A9AA1" },
  cta: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: { color: "white", fontWeight: "700", fontSize: 18 },
});
