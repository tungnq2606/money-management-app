import { useAuthStore } from "@/stores";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DetailProfile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [value, setValue] = useState(user ? { ...user } : null);
  const [show, setShow] = useState(false);

  // format ngày để hiển thị trong input
  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Hàm xử lý update
  const handleUpdate = () => {
    if (!value?.name?.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (value?.phoneNumber && isNaN(Number(value.phoneNumber))) {
      Alert.alert("Error", "Invalid phone number");
      return;
    }

    try {
      updateUser({
        name: value.name,
        address: value.address,
        birthday: value.birthday ? new Date(value.birthday) : undefined,
        phoneNumber: value.phoneNumber ? Number(value.phoneNumber) : undefined,
        email: value.email,
      });

      Alert.alert(
        "Success",
        "Your information has been updated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Update user failed:", error);
      Alert.alert("Error", "Unable to update your information!");
    }
  };

  const showMode = () => {
    setShow(!show);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Name */}
      <View style={styles.viewInput}>
        <Text>Name</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={value?.name}
          onChangeText={(text) =>
            setValue((prev) => (prev ? { ...prev, name: text } : prev))
          }
          placeholderTextColor="#8f8e8eff"
        />
      </View>

      {/* Address */}
      <View style={styles.viewInput}>
        <Text>Address</Text>
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={value?.address}
          onChangeText={(text) =>
            setValue((prev) => (prev ? { ...prev, address: text } : prev))
          }
          placeholderTextColor="#8f8e8eff"
        />
      </View>

      {/* Birthday */}
      {/* <View style={styles.viewInput}>
        <Text>Birthday</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.input}
          value={formatDate(value?.birthday)}
          onChangeText={(text) => {
            const [year, month, day] = text.split("-");
            if (day && month && year) {
              const date = new Date(+year, +month - 1, +day);
              if (!isNaN(date.getTime())) {
                setValue((prev) => ({ ...prev, birthday: date.toISOString() }));
              }
            }
          }}
          placeholderTextColor="#8f8e8eff"
        />
      </View> */}

      {/* Phone */}
      <View style={styles.viewInput}>
        <Text>Phone</Text>
        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={value?.phoneNumber?.toString()}
          onChangeText={(text) =>
            setValue((prev) =>
              prev ? { ...prev, phoneNumber: Number(text) } : prev
            )
          }
          placeholderTextColor="#8f8e8eff"
          keyboardType="numeric"
        />
      </View>

      {/* Update button */}
      <View style={styles.viewAdd}>
        <TouchableOpacity style={styles.btnAdd} onPress={handleUpdate}>
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
