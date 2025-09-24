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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HeaderApp from "../components/HeaderApp";
import { useAuthStore } from "../stores";

const DetailProfile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [value, setValue] = useState(user ? { ...user } : null);
  const [show, setShow] = useState(false);

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
      <HeaderApp title={"Profile"} isBack={true} />

      {/* Name */}
      <View style={styles.viewInput}>
        <Text style={styles.label}>Name</Text>
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
        <Text style={styles.label}>Address</Text>
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
      <View style={styles.viewInput}>
        <Text style={styles.label}>Birthday</Text>
        <TouchableOpacity style={styles.input} onPress={showMode}>
          <Text
            style={value?.birthday ? styles.inputText : styles.inputPlaceholder}
          >
            {value?.birthday
              ? formatDate(value.birthday)
              : "Select your birthday"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={show}
          mode="date"
          maximumDate={new Date()}
          date={value?.birthday ? new Date(value.birthday) : new Date()}
          onConfirm={(date) => {
            setValue((prev) => (prev ? { ...prev, birthday: date } : prev));
            setShow(false);
          }}
          onCancel={() => setShow(false)}
        />
      </View>

      {/* Phone */}
      <View style={styles.viewInput}>
        <Text style={styles.label}>Phone</Text>
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
