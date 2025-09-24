import HeaderApp from "@/components/HeaderApp";
import { formatMoney } from "@/constants/formatMoney";
import { useAuthStore, useWalletStore } from "@/stores";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WalletItem {
  id: number;
  name: string;
  amount: number;
}

const Wallet = () => {
  const { user } = useAuthStore();
  const { loadWallets, wallets, totalAmount } = useWalletStore();
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (user?._id) {
      loadWallets(String(user._id));
    }

    if (totalAmount) {
      setTotal(totalAmount);
    }

    if (wallets) {
      setData(wallets);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <HeaderApp title="Wallet" isBack={true} />

      <View style={styles.viewBalance}>
        <Text style={styles.txtAccountBalance}>Account Balance</Text>
        <Text style={styles.txtBalance}>{formatMoney(total)}</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        {data.map((item: WalletItem, index: number) => (
          <View
            key={index}
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
                <Ionicons name="wallet" size={24} color="#7F3DFF" />
              </View>
              <Text style={styles.txtName}>{item?.name}</Text>
            </View>
            <Text style={styles.txtAmount}>{formatMoney(item?.amount)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.viewAdd}>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => router.push("/addWallet")}
        >
          <Text style={styles.txtAdd}>+ Add new wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewHeader: {
    marginBottom: 30,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  txtHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
  },
  viewBalance: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE5FF",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  txtBalance: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  txtAccountBalance: {
    fontSize: 16,
    color: "#636363ff",
  },
  itemWallet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  txtName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
    padding: 16,
  },
  btnAdd: {
    backgroundColor: "#7F3DFF",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  txtAdd: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

const data_wallet = [
  {
    id: 1,
    name: "TPBank",
    amount: 1000000,
  },
  {
    id: 2,
    name: "Vietcombank",
    amount: 2000000,
  },
];
