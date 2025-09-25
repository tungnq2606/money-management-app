import FormInput from "@/components/FormInput";
import HeaderApp from "@/components/HeaderApp";
import { formatNumber } from "@/constants/formatMoney";
import { useAuthStore, useWalletStore } from "@/stores";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
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

interface WalletFormData {
  name: string;
  amount: string;
  type: string;
}

const AddWallet = () => {
  const params = useLocalSearchParams<{ walletId?: string }>();
  const walletId = params?.walletId;
  const { user } = useAuthStore();
  const { createWallet, walletById, updateWallet } = useWalletStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<WalletFormData>({
    name: "",
    amount: "",
    type: "cash",
  });
  const [errors, setErrors] = useState<Partial<WalletFormData>>({});

  useEffect(() => {
    if (walletId) {
      const wallet = walletById(walletId);
      if (wallet) {
        setFormData({
          name: wallet.name,
          amount: wallet.amount.toString(),
          type: wallet.type,
        });
      }
    }
  }, [walletId, walletById]);

  const validateForm = (): boolean => {
    const newErrors: Partial<WalletFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Wallet name is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) < 0
    ) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?._id) {
      Alert.alert("Error", "User not found.");
      return;
    }

    const walletData = {
      userId: String(user._id),
      name: formData.name.trim(),
      type: formData.type,
      amount: parseFloat(formData.amount),
    };

    try {
      const success = walletId
        ? await updateWallet(walletId, walletData)
        : await createWallet(walletData);

      if (success) {
        const message = walletId
          ? "Wallet updated successfully!"
          : "Wallet created successfully!";
        Alert.alert("Success", message, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        const message = walletId
          ? "Failed to update wallet."
          : "Failed to create wallet.";
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error("Error saving wallet:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const selectedType = walletTypes.find((w) => w.key === formData.type);

  const handleInputChange = (field: keyof WalletFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <HeaderApp
        title={walletId ? "Edit Wallet" : "Add Wallet"}
        isBack={true}
      />

      <View style={styles.viewForm}>
        <FormInput
          label="Wallet Name"
          placeholder="Enter wallet name"
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          errorMessage={errors.name}
        />

        <FormInput
          label="Amount"
          placeholder="Enter amount"
          value={formatNumber(Number(formData.amount))}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            handleInputChange("amount", numericValue);
          }}
          errorMessage={errors.amount}
          keyboardType="numeric"
        />

        {/* Wallet Type Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Wallet Type</Text>
          <TouchableOpacity
            style={styles.selectTypeButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectTypeContent}>
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
      </View>

      <View style={styles.viewAdd}>
        <TouchableOpacity style={styles.btnAdd} onPress={handleSubmit}>
          <Text style={styles.txtAdd}>
            {walletId ? "Update Wallet" : "Create Wallet"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wallet Type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {walletTypes.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.modalItem,
                    formData.type === item.key && styles.selectedItem,
                  ]}
                  onPress={() => {
                    handleInputChange("type", item.key);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemContent}>
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </View>
                  {formData.type === item.key && (
                    <AntDesign name="check" size={18} color="#7F3DFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  selectTypeButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectTypeContent: {
    flexDirection: "row",
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
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: "#000",
  },
  viewForm: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
