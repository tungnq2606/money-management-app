import { useAuthStore } from "@/stores";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DetailProfile = () => {
  const { user } = useAuthStore();
  const [value, setValue] = useState(user);
  const formatDate = (isoString: string) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.viewInput}>
        <Text>Name</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={value?.name}
          placeholderTextColor={"#8f8e8eff"}
        />
      </View>
      <View style={styles.viewInput}>
        <Text>Address</Text>
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={value?.address}
          placeholderTextColor={"#8f8e8eff"}
        />
      </View>
      <View style={styles.viewInput}>
        <Text>Birthday</Text>
        <TextInput
          placeholder="Birthday"
          style={styles.input}
          value={formatDate(value?.birthday)}
          placeholderTextColor={"#8f8e8eff"}
        />
      </View>

      <View style={styles.viewInput}>
        <Text>Phone</Text>
        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={value?.phoneNumber?.toString()}
          placeholderTextColor={"#8f8e8eff"}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.viewAdd}>
        <TouchableOpacity style={styles.btnAdd}>
          <Text style={styles.txtAdd}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailProfile;

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
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
  },
  viewInput: {
    marginHorizontal: 20,
  },
});
