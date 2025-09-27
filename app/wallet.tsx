import HeaderApp from "@/components/HeaderApp";
import { formatMoney } from "@/constants/formatMoney";
import { useAuthStore, useWalletStore } from "@/stores";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WalletItem {
  _id: string;
  id?: number;
  name: string;
  amount: number;
  type: string;
}

const Wallet = () => {
  const { loadWallets, wallets, totalAmount, deleteWallet } = useWalletStore();
  const { user } = useAuthStore();
  const [data, setData] = useState<WalletItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [itemSelected, setItemSelected] = useState<WalletItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (user?._id) {
      loadWallets(String(user._id));
    }
  }, [user?._id, isFocused]);

  useEffect(() => {
    if (wallets) {
      setData(
        wallets.map((w) => ({
          ...w,
          _id: String(w._id),
        }))
      ); // Ensure _id is a string for WalletItem
    }
    if (totalAmount !== undefined) {
      setTotal(totalAmount);
    }
  }, [wallets, totalAmount]);

  const handleDeleteWallet = async (walletId: string) => {
    const success = await deleteWallet(walletId);
    if (success) {
      loadWallets(String(user?._id));
      Alert.alert("Success", "Wallet deleted successfully.");
    }
  };

  const renderItem = ({ item, index }: { item: WalletItem; index: number }) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        setItemSelected(item);
        setModalVisible(true);
      }}
      style={[
        styles.itemWallet,
        {
          borderBottomWidth: index === data.length - 1 ? 0 : 1,
          borderBottomColor: "#dcdcdcff",
        },
      ]}
    >
      <View style={styles.viewName}>
        <View style={styles.viewIcon}>
          <Ionicons
            name={
              item?.type === "ewallet"
                ? "phone-portrait-outline"
                : item?.type === "bank"
                ? "business-outline"
                : "cash-outline"
            }
            size={24}
            color={
              item?.type === "ewallet"
                ? "#3B82F6"
                : item?.type === "bank"
                ? "#10B981"
                : "#7F3DFF"
            }
          />
        </View>
        <Text style={styles.txtName}>{item?.name}</Text>
      </View>
      <Text style={styles.txtAmount}>{formatMoney(item?.amount)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderApp title="Wallet" isBack={true} />

      <View style={styles.viewBalance}>
        <Text style={styles.txtAccountBalance}>Account Balance</Text>
        <Text style={styles.txtBalance}>{formatMoney(total)}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <View style={styles.viewAdd}>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => router.push("/addWallet")}
        >
          <Text style={styles.txtAdd}>+ Add new wallet</Text>
        </TouchableOpacity>
      </View>

      {/* Modal kept if you still want popup option */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{itemSelected?.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                router.push({
                  pathname: "/addWallet",
                  params: { walletId: itemSelected?._id },
                });
                setModalVisible(false);
              }}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                Alert.alert(
                  "Confirm Delete",
                  `Are you sure you want to delete this wallet ${itemSelected?.name}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        handleDeleteWallet(itemSelected?._id ?? "");
                        setModalVisible(false);
                      },
                    },
                  ]
                );
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // light gray background for a gentle feel
  },
  viewHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  txtHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  viewBalance: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "#EEE5FF",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  txtAccountBalance: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  txtBalance: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1F2937",
  },
  itemWallet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  txtName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  txtAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewName: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewIcon: {
    backgroundColor: "#EEE5FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginRight: 8,
  },
  viewAdd: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  btnAdd: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7F3DFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  txtAdd: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
});
