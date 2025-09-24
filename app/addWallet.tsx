import { formatNumber } from "@/constants/formatMoney";
import { useAuthStore, useWalletStore } from "@/stores";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const walletTypes = [
  { key: "cash", label: "Cash", icon: "cash-outline", color: "#7F3DFF" },
  { key: "bank", label: "Bank", icon: "business-outline", color: "#10B981" },
  {
    key: "ewallet",
    label: "E-Wallet",
    icon: "phone-portrait-outline",
    color: "#3B82F6",
  },
];

const AddWallet = () => {
  const params = useLocalSearchParams<{ walletId?: string }>();
  const walletId = params?.walletId;
  const { user } = useAuthStore();
  const { createWallet, walletById, updateWallet } = useWalletStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState({
    name: "",
    amount: "",
    type: "cash",
  });

  useEffect(() => {
    if (walletId) {
      const wallet = walletById(walletId);
      if (wallet) {
        setValue({
          name: wallet.name,
          amount: wallet.amount.toString(),
          type: wallet.type,
        });
      }
    }
  }, [walletId]);

  const handleAddWallet = async () => {
    const { name, amount, type } = value;
    if (!name || !amount) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (!user?._id) {
      Alert.alert("Error", "User not found.");
      return;
    }
    const walletData = {
      userId: String(user._id),
      name,
      type,
      amount: parseFloat(amount),
    };
    try {
      const success = await createWallet(walletData);
      if (success) {
        Alert.alert("Success", "Wallet created successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Failed to create wallet.");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleUpdateWallet = async () => {
    const { name, amount, type } = value;
    if (!name || !amount) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (!user?._id) {
      Alert.alert("Error", "User not found.");
      return;
    }
    if (!walletId) {
      Alert.alert("Error", "Wallet ID not found.");
      return;
    }
    const walletData = {
      userId: String(user._id),
      name,
      type,
      amount: parseFloat(amount),
    };
    try {
      const success = await updateWallet(walletId, walletData);
      if (success) {
        Alert.alert("Success", "Wallet updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Failed to update wallet.");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const selectedType = walletTypes.find((w) => w.key === value.type);

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>
          {walletId ? "Edit Wallet" : "Add Wallet"}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.viewForm}>
        <TextInput
          placeholder="Wallet Name"
          style={styles.input}
          value={value.name}
          onChangeText={(text) => setValue({ ...value, name: text })}
          placeholderTextColor={"#8f8e8eff"}
        />
        <TextInput
          placeholder="Amount"
          style={styles.input}
          value={formatNumber(Number(value.amount))}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            setValue({ ...value, amount: numericValue });
          }}
          placeholderTextColor={"#8f8e8eff"}
          keyboardType="numeric"
        />

        {/* Nút chọn loại ví (mở modal) */}
        <TouchableOpacity
          style={styles.selectTypeButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={(selectedType?.icon || "wallet-outline") as any}
              size={22}
              color={selectedType?.color || "#6B7280"}
            />
            <Text style={styles.selectTypeText}>
              {selectedType?.label || "Select Wallet Type"}
            </Text>
          </View>
          <AntDesign name="down" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.viewAdd}>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={walletId ? handleUpdateWallet : handleAddWallet}
        >
          <Text style={styles.txtAdd}>{walletId ? "Update" : "Create"}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn loại ví */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                Select Wallet Type
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={walletTypes}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.walletOption,
                    value.type === item.key && styles.walletOptionActive,
                  ]}
                  onPress={() => {
                    setValue((prev) => ({ ...prev, type: item.key }));
                    setModalVisible(false);
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.walletName}>{item.label}</Text>
                  {value.type === item.key && (
                    <AntDesign
                      name="checkcircle"
                      size={20}
                      color={item.color}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  txtHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E1E1E",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectTypeButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectTypeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  viewAdd: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FB",
  },
  btnAdd: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#7F3DFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  txtAdd: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    paddingTop: 10,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  walletOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  walletOptionActive: {
    backgroundColor: "#F3E8FF",
  },
  walletName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  viewForm: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
