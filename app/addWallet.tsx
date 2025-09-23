import { useAuthStore, useWalletStore } from "@/stores";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddWallet = () => {
  const { user } = useAuthStore();
  const { createWallet } = useWalletStore();
  const [value, setValue] = useState({
    name: "",
    amount: "",
    type: "cash",
  });

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
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create wallet.");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Add Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

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
        value={value.amount}
        onChangeText={(text) => setValue({ ...value, amount: text })}
        placeholderTextColor={"#8f8e8eff"}
        keyboardType="numeric"
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.touchSelect}
          onPress={() => setValue({ ...value, type: "expense" })}
        >
          <Ionicons
            name={
              value.type === "cash"
                ? "radio-button-on-outline"
                : "radio-button-off-outline"
            }
            size={24}
            color={value.type === "cash" ? "#7F3DFF" : "black"}
          />
          <Text style={styles.txtIncome}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchSelect}
          onPress={() => setValue({ ...value, type: "income" })}
        >
          <Ionicons
            name={
              value.type === "card"
                ? "radio-button-on-outline"
                : "radio-button-off-outline"
            }
            size={24}
            color={value.type === "card" ? "#7F3DFF" : "black"}
          />
          <Text style={styles.txtIncome}>Card</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewAdd}>
        <TouchableOpacity style={styles.btnAdd} onPress={handleAddWallet}>
          <Text style={styles.txtAdd}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddWallet;

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
  viewAdd: {
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
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
  input: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  touchSelect: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 10,
    marginBottom: 20,
  },
  txtIncome: {
    marginLeft: 10,
  },
});
