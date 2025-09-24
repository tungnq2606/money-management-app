import HeaderApp from "@/components/HeaderApp";
import TransactionItem from "@/components/TransactionItem";
import { getGlobalCategoryService } from "@/database/services";
import { useTransactionStore } from "@/stores/transactionStore";
import { useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

type SectionItem = {
  id: string;
  type: string;
  description: string;
  amount: number;
  time: string;
  icon: string;
  color: string;
};

type SectionData = { title: string; data: SectionItem[] };

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getIconAndColorByType(type: "income" | "expense") {
  if (type === "income") return { icon: "creditcard", color: "#B7F4C3" };
  return { icon: "shoppingcart", color: "#FFD8A8" };
}

export default function TransactionScreen() {
  const { transactions, loadTransactionsWithFilters, isLoading } =
    useTransactionStore();
  const [categoryNameById, setCategoryNameById] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    loadTransactionsWithFilters({});
    const categories = getGlobalCategoryService().getAllCategories();
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c._id.toString(), c.name));
    setCategoryNameById(map);
  }, [loadTransactionsWithFilters]);

  const sections: SectionData[] = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayItems: SectionItem[] = [];
    const yesterdayItems: SectionItem[] = [];
    const earlierItems: SectionItem[] = [];

    transactions.forEach((t) => {
      const createdAt = new Date(t.createdAt);
      const title =
        categoryNameById.get(t.categoryId) ||
        (t.type === "income" ? "Income" : "Expense");
      const { icon, color } = getIconAndColorByType(t.type);
      const item: SectionItem = {
        id: t._id.toString(),
        type: title,
        description: t.note || "",
        amount: t.type === "income" ? t.amount : -t.amount,
        time: formatTime(createdAt),
        icon,
        color,
      };

      if (isSameDay(createdAt, today)) {
        todayItems.push(item);
      } else if (isSameDay(createdAt, yesterday)) {
        yesterdayItems.push(item);
      } else {
        earlierItems.push(item);
      }
    });

    const sectionsBuilt: SectionData[] = [];
    if (todayItems.length)
      sectionsBuilt.push({ title: "Today", data: todayItems });
    if (yesterdayItems.length)
      sectionsBuilt.push({ title: "Yesterday", data: yesterdayItems });
    if (earlierItems.length)
      sectionsBuilt.push({ title: "Earlier", data: earlierItems });
    return sectionsBuilt;
  }, [transactions, categoryNameById]);

  const _renderItem = ({ item }: { item: SectionItem }) => {
    return (
      <TransactionItem
        id={item.id}
        type={item.type}
        description={item.description}
        amount={item.amount}
        time={item.time}
        icon={item.icon}
        color={item.color}
      />
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <HeaderApp title={"Transactions"} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ flex: 1, flexGrow: 1, padding: 16 }}
        refreshing={isLoading}
        onRefresh={() => loadTransactionsWithFilters({})}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No data</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8f8e8eff",
  },
});
