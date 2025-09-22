import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Wallet</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.viewBalance}>
        <Text style={styles.txtAccountBalance}>Account Balance</Text>
        <Text style={styles.txtBalance}>2000000đ</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        {data_wallet.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemWallet,
              {
                borderBottomWidth: index === data_wallet.length - 1 ? 0 : 1,
                borderBottomColor: "#dcdcdcff",
              },
            ]}
          >
            <View style={styles.viewName}>
              <View style={styles.viewIcon}>
                <Ionicons name="wallet" size={24} color="#7F3DFF" />
              </View>
              <Text style={styles.txtName}>{item.name}</Text>
            </View>
            <Text style={styles.txtAmount}>{item.amount}đ</Text>
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
    marginRight: 5,
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
