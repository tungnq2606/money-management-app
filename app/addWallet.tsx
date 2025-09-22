import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddWallet = () => {
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
        placeholderTextColor={"#8f8e8eff"}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        placeholderTextColor={"#8f8e8eff"}
        keyboardType="numeric"
      />
      <View style={styles.viewAdd}>
        <TouchableOpacity style={styles.btnAdd}>
          <Text style={styles.txtAdd}>Confirm</Text>
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
});
