import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateInput from "../components/DateInput";
import FormInput from "../components/FormInput";
import HeaderApp from "../components/HeaderApp";
import { useAuthStore } from "../stores";

const DetailProfile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [value, setValue] = useState(user ? { ...user } : null);

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

  return (
    <View style={styles.container}>
      <HeaderApp title={"Profile"} isBack={true} />

      {/* Name */}
      <FormInput
        label="Name"
        placeholder="Name"
        containerStyle={styles.viewInput}
        value={value?.name ?? ""}
        onChangeText={(text) =>
          setValue((prev) => (prev ? { ...prev, name: text } : prev))
        }
      />

      {/* Address */}
      <FormInput
        label="Address"
        placeholder="Address"
        containerStyle={styles.viewInput}
        value={value?.address ?? ""}
        onChangeText={(text) =>
          setValue((prev) => (prev ? { ...prev, address: text } : prev))
        }
      />

      {/* Birthday */}
      <DateInput
        label="Birthday"
        value={value?.birthday ?? null}
        maximumDate={new Date()}
        containerStyle={styles.viewInput}
        inputStyle={styles.input}
        onChange={(date) =>
          setValue((prev) => (prev ? { ...prev, birthday: date } : prev))
        }
      />

      {/* Phone */}
      <FormInput
        label="Phone"
        placeholder="Phone"
        containerStyle={styles.viewInput}
        value={value?.phoneNumber?.toString() ?? ""}
        onChangeText={(text) =>
          setValue((prev) =>
            prev ? { ...prev, phoneNumber: Number(text) } : prev
          )
        }
        keyboardType="numeric"
      />

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
    backgroundColor: "#F9FAFB",
  },
  viewHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    flex: 1,
  },
  viewInput: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  inputText: {
    color: "#000",
  },
  inputPlaceholder: {
    color: "#8f8e8eff",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  touchSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 1,
    marginRight: 10,
  },
  txtIncome: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  viewAdd: {
    marginTop: "auto",
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  btnAdd: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#7F3DFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  txtAdd: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
