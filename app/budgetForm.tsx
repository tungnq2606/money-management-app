import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MonthSelector from "../components/MonthSelector";
import { formatNumber } from "../constants/formatMoney";
import {
  getGlobalBudgetService,
  getGlobalCategoryService,
  getGlobalWalletService,
  type CreateBudgetData,
} from "../database/services";
import { useAuthStore } from "../stores/authStore";
import { useBudgetActions } from "../stores/storeHooks";

export default function BudgetFormScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const budgetId = (params?.id as string | undefined) || undefined;
  const user = useAuthStore((s) => s.user);
  const { createBudget, updateBudget } = useBudgetActions();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [loop, setLoop] = useState(false);

  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [wallets, setWallets] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // For edit mode computations
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);
  const [originalRemain, setOriginalRemain] = useState<number | null>(null);

  // Budget period: default to current month
  const [monthIndex, setMonthIndex] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { fromDate, toDate } = useMemo(() => {
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
    return { fromDate: start, toDate: end };
  }, [monthIndex, year]);

  useEffect(() => {
    if (!user) return;
    try {
      const walletList = getGlobalWalletService()
        .getWalletsByUserId(user._id.toString())
        .map((w) => ({ id: w._id.toString(), name: w.name }));
      setWallets(walletList);

      const expenseCategories = getGlobalCategoryService()
        .getCategoriesByType(user._id.toString(), "expense")
        .map((c) => ({ id: c._id.toString(), name: c.name }));
      setCategories(expenseCategories);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load wallets or categories");
    }
  }, [user]);

  // Load existing budget when editing
  useEffect(() => {
    if (!budgetId) return;
    try {
      const found = getGlobalBudgetService().getBudgetById(budgetId);
      if (!found) return;
      setName(found.name);
      setAmount(formatNumber(found.amount));
      setNote(found.note || "");
      setLoop(!!found.loop);
      setSelectedWalletIds(found.walletId || []);
      setSelectedCategoryId(found.categoryId);

      // Set period based on fromDate
      const from = new Date(found.fromDate);
      setMonthIndex(from.getMonth());
      setYear(from.getFullYear());

      setOriginalAmount(found.amount);
      setOriginalRemain(found.remain);
    } catch (e) {
      console.error(e);
    }
  }, [budgetId]);

  const toggleWallet = (id: string) => {
    setSelectedWalletIds((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const onMonthChange = (mIndex: number, _name: string) => {
    const now = new Date();
    const newYear = now.getFullYear();
    setYear(newYear);
    setMonthIndex(mIndex);
  };

  const validateAndSave = async () => {
    if (!user) {
      Alert.alert("Not signed in", "Please sign in to create a budget.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a budget name.");
      return;
    }
    const amountNum = Number(amount.replace(/[^\d]/g, ""));
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Validation", "Please enter a valid amount (> 0).");
      return;
    }
    if (selectedWalletIds.length === 0) {
      Alert.alert("Validation", "Please select at least one wallet.");
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert("Validation", "Please select a category.");
      return;
    }

    try {
      if (budgetId) {
        // Edit mode: preserve spent = originalAmount - originalRemain
        const spent = Math.max(
          0,
          (originalAmount ?? amountNum) - (originalRemain ?? amountNum)
        );
        const newRemain = Math.max(0, amountNum - spent);

        const ok = await updateBudget(budgetId, {
          name: name.trim(),
          walletId: selectedWalletIds,
          categoryId: selectedCategoryId,
          userId: user._id.toString(),
          amount: amountNum,
          remain: newRemain,
          loop,
          fromDate,
          toDate,
          note: note.trim(),
        });
        if (!ok) throw new Error("update budget failed");
        Alert.alert("Success", "Budget updated successfully.", [
          { text: "OK", onPress: () => router.replace("/(tabs)/budget") },
        ]);
      } else {
        const payload: CreateBudgetData = {
          name: name.trim(),
          walletId: selectedWalletIds,
          categoryId: selectedCategoryId,
          userId: user._id.toString(),
          amount: amountNum,
          remain: amountNum,
          loop,
          fromDate,
          toDate,
          note: note.trim(),
        };
        const ok = await createBudget(payload);
        if (!ok) throw new Error("create budget failed");
        Alert.alert("Success", "Budget created successfully.", [
          { text: "OK", onPress: () => router.replace("/(tabs)/budget") },
        ]);
      }
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Error",
        budgetId ? "Failed to update budget." : "Failed to create budget."
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <AntDesign name="left" size={18} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {budgetId ? "Edit Budget" : "Create Budget"}
        </Text>
        <View style={{ width: 18 }} />
      </View>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Food & Drink"
              placeholderTextColor="#C4C4C4"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={(text) => {
                const digits = text.replace(/[^\d]/g, "");
                const formatted = digits ? formatNumber(Number(digits)) : "";
                setAmount(formatted);
              }}
              keyboardType="numeric"
              placeholder="e.g. 1000"
              placeholderTextColor="#C4C4C4"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Wallets</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setWalletModalVisible(true)}
            >
              <Text style={styles.dropdownText}>
                {selectedWalletIds.length > 0
                  ? `${selectedWalletIds.length} selected`
                  : "Select wallets"}
              </Text>
              <AntDesign name="down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCategoryId && styles.placeholderText,
                ]}
              >
                {selectedCategoryId
                  ? categories.find((c) => c.id === selectedCategoryId)?.name
                  : "Select category"}
              </Text>
              <AntDesign name="down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Period</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <MonthSelector
                initialMonth={monthIndex}
                onMonthChange={(idx) => onMonthChange(idx, "")}
              />
              <Text style={{ color: "#666" }}>
                {fromDate.toDateString()} - {toDate.toDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Repeat Every Month</Text>
            <TouchableOpacity
              onPress={() => setLoop((v) => !v)}
              style={[styles.toggle, loop && styles.toggleOn]}
              activeOpacity={0.8}
            >
              <View style={[styles.knob, loop && styles.knobOn]} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Note (optional)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              placeholderTextColor="#C4C4C4"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
            <Text style={styles.saveButtonText}>
              {budgetId ? "Update budget" : "Create budget"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Wallet Multi-select Modal */}
      <Modal
        visible={walletModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWalletModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wallets</Text>
              <TouchableOpacity onPress={() => setWalletModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {wallets.map((w) => {
                const selected = selectedWalletIds.includes(w.id);
                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.modalItem, selected && styles.selectedItem]}
                    onPress={() => toggleWallet(w.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalItemText}>{w.name}</Text>
                    {selected && (
                      <AntDesign name="check" size={18} color="#7F3DFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Select Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategoryId(c.id);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#7F3DFF",
    flex: 1,
  },
  header: {
    height: 130,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontWeight: "600", fontSize: 20 },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FAFAFA",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    color: "#C4C4C4",
  },
  toggle: {
    width: 56,
    height: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 4,
  },
  toggleOn: {
    backgroundColor: "#7F3DFF",
  },
  knob: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  knobOn: {
    marginLeft: 24,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: { color: "white", fontWeight: "700", fontSize: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#F7F4FF",
  },
  modalItemText: {
    fontSize: 16,
    color: "#000",
  },
});
