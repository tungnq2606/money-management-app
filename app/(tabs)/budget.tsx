import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as React from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import HeaderApp from "../../components/HeaderApp";
import { months } from "../../constants";
import { formatMoney, formatNumber } from "../../constants/formatMoney";
import { getGlobalBudgetService } from "../../database/services";
import { useAuthStore } from "../../stores/authStore";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function BudgetListScreen() {
  const { user } = useAuthStore();

  const [budgets, setBudgets] = React.useState<any[]>([]);

  const [monthIndex, setMonthIndex] = React.useState(new Date().getMonth());

  const goPrev = () => {
    setMonthIndex((m) => (m - 1 + months.length) % months.length);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const goNext = () => {
    setMonthIndex((m) => (m + 1) % months.length);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const loadBudgets = React.useCallback(() => {
    if (!user) return;
    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const allBudgets = getGlobalBudgetService().getBudgetsByUserId(
      user._id.toString()
    );

    // Filter budgets that overlap with the selected month
    const selected = allBudgets.filter(
      (b) => b.fromDate <= endDate && b.toDate >= startDate
    );

    const palette = ["#7F3DFF", "#4D7CFE", "#FDBC10", "#FF4D4F", "#22C55E"];
    const mapped = selected.map((b, idx) => {
      const spent = Math.max(0, (b.amount || 0) - (b.remain || 0));
      return {
        id: b._id.toString(),
        name: b.name,
        color: palette[idx % palette.length],
        spent,
        limit: b.amount,
      };
    });
    setBudgets(mapped);
  }, [user, monthIndex]);

  console.log(budgets);
  React.useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  useFocusEffect(
    React.useCallback(() => {
      loadBudgets();
    }, [loadBudgets])
  );

  const Header = (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={goPrev}
        hitSlop={8}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#7F3DFF",
        }}
      >
        <AntDesign name="left" size={18} color="#ffffff" />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

          height: 40,
        }}
      >
        <Text style={styles.headerTitle}>{months[monthIndex]}</Text>
      </View>
      <TouchableOpacity
        onPress={goNext}
        hitSlop={8}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#7F3DFF",
        }}
      >
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
    <View style={styles.safeArea}>
      <HeaderApp title={"Budget"} />
      <View style={styles.headerContainer}>{Header}</View>
      <View style={styles.contentContainer}>{Body}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "100%",
  },
  headerTitle: { color: "black", fontWeight: "500", fontSize: 18 },
  contentContainer: {
    flex: 1,
    paddingBottom: 100,
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
