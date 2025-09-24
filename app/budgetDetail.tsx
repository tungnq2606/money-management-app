import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderApp from "../components/HeaderApp";
import { formatMoney } from "../constants/formatMoney";
import {
  getGlobalBudgetService,
  getGlobalCategoryService,
} from "../database/services";

type BudgetView = {
  id: string;
  name: string;
  amount: number;
  remain: number;
  categoryId: string;
  fromDate: Date;
  toDate: Date;
  note: string;
  loop: boolean;
};

export default function BudgetDetail() {
  const params = useLocalSearchParams<{ id?: string }>();
  const budgetId = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetView | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    try {
      if (!budgetId) {
        setError("Missing budget id");
        setLoading(false);
        return;
      }

      const found = getGlobalBudgetService().getBudgetById(budgetId);
      if (!found) {
        setError("Budget not found");
        setLoading(false);
        return;
      }

      setBudget({
        id: found._id.toString(),
        name: found.name,
        amount: found.amount,
        remain: found.remain,
        categoryId: found.categoryId,
        fromDate: found.fromDate,
        toDate: found.toDate,
        note: found.note,
        loop: found.loop,
      });

      const category = getGlobalCategoryService().getCategoryById(
        found.categoryId
      );
      if (category) setCategoryName(category.name);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Failed to load budget");
      setLoading(false);
    }
  }, [budgetId]);

  const exceeded = useMemo(
    () => (budget ? budget.remain <= 0 : false),
    [budget]
  );
  const spent = useMemo(() => {
    if (!budget) return 0;
    return Math.max(0, budget.amount - budget.remain);
  }, [budget]);
  const progress = useMemo(() => {
    if (!budget || budget.amount <= 0) return 0;
    return Math.min(1, spent / budget.amount);
  }, [budget, spent]);
  const periodText = useMemo(() => {
    if (!budget) return "";
    return `${budget.fromDate.toDateString()} - ${budget.toDate.toDateString()}`;
  }, [budget]);

  const confirmDelete = () => {
    if (!budget) return;
    setDeleteVisible(true);
  };

  const onDelete = () => {
    if (!budget) return;
    try {
      getGlobalBudgetService().deleteBudget(budget.id);
      setDeleteVisible(false);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to delete budget");
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !budget) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <AntDesign name="left" size={18} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Budget</Text>
          <View style={styles.headerRightSpacer} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || "Not found"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <HeaderApp
        title={"Detail Budget"}
        isBack={true}
        rightComponent={
          <TouchableOpacity onPress={confirmDelete} hitSlop={8}>
            <Ionicons name="trash-bin-sharp" size={24} color="black" />
          </TouchableOpacity>
        }
      />

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.tag}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>{budget.name || categoryName}</Text>
          </View>

          <Text style={styles.remainingTitle}>Remaining</Text>
          <Text style={styles.remainingAmount}>
            {formatMoney(Math.max(0, budget.remain))}
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>

          {exceeded && (
            <View style={styles.warning}>
              <AntDesign name="exclamationcircleo" size={16} color="#fff" />
              <Text style={styles.warningText}>You’ve exceed the limit</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Budget</Text>
            <Text style={styles.summaryValue}>
              {formatMoney(budget.amount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={styles.summaryValue}>{formatMoney(spent)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Period</Text>
            <Text style={styles.summaryValue}>{periodText}</Text>
          </View>

          {budget.note ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Note</Text>
              <Text
                style={[styles.summaryValue, { flex: 1, textAlign: "right" }]}
                numberOfLines={3}
              >
                {budget.note}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/budgetForm",
              params: { id: budget.id },
            })
          }
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Delete confirmation modal */}
      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.deleteModal}>
            <View style={styles.modalNotch} />
            <Text style={styles.deleteTitle}>Remove this budget?</Text>
            <Text style={styles.deleteDesc}>
              Are you sure do you wanna remove this budget?
            </Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity
                onPress={() => setDeleteVisible(false)}
                style={styles.btnNo}
              >
                <Text style={styles.btnNoText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.btnYes}>
                <Text style={styles.btnYesText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 12,
    backgroundColor: "#7F3DFF",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontWeight: "600", fontSize: 20 },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  body: {
    padding: 16,
    gap: 16,
  },
  bottomActions: {
    marginTop: "auto",
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  tag: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#FDBC10",
  },
  tagText: { color: "#333", fontWeight: "600" },
  remainingTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E1E1E",
    textAlign: "center",
  },
  remainingAmount: {
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    color: "#000",
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
    backgroundColor: "#FDBC10",
  },
  warning: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FF4D4F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  warningText: { color: "#fff", fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: { color: "#9A9AA1" },
  summaryValue: { color: "#1E1E1E", fontWeight: "600" },
  editButton: {
    marginTop: 24,
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: { color: "white", fontWeight: "700", fontSize: 18 },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    // paddingHorizontal: 20,
  },
  deleteModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#1E1E1E",
  },
  headerRightSpacer: {
    width: 18,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#1E1E1E",
  },
  modalNotch: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C9B5FF",
    marginBottom: 12,
  },
  deleteTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  deleteDesc: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 16,
  },
  deleteActions: {
    flexDirection: "row",
    gap: 12,
  },
  btnNo: {
    flex: 1,
    backgroundColor: "#EFE9FF",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  btnNoText: {
    color: "#7F3DFF",
    fontWeight: "700",
  },
  btnYes: {
    flex: 1,
    backgroundColor: "#7F3DFF",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  btnYesText: {
    color: "#fff",
    fontWeight: "700",
  },
});
