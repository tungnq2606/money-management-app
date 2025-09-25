import { AntDesign } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateInput from "./DateInput";

interface OptionItem {
  id: string;
  name: string;
}

interface TransactionFormProps {
  categoryId: string;
  setCategoryId: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  walletId: string;
  setWalletId: (value: string) => void;
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isIncome: boolean;
  buttonColor: string;
  onSave: () => void;
  categoryOptions: OptionItem[];
  walletOptions: OptionItem[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  categoryId,
  setCategoryId,
  note,
  setNote,
  walletId,
  setWalletId,
  imageUri,
  setImageUri,
  selectedDate,
  setSelectedDate,
  isIncome,
  buttonColor,
  onSave,
  categoryOptions,
  walletOptions,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const selectedCategoryName =
    categoryOptions.find((c) => c.id === categoryId)?.name || "";
  const selectedWalletName =
    walletOptions.find((w) => w.id === walletId)?.name || "";

  // const pickImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Permission denied",
  //       "We need camera roll permissions to select an image."
  //     );
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImageUri(result.assets[0].uri);
  //   }
  // };

  // const takePhoto = async () => {
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Permission denied",
  //       "We need camera permissions to take a photo."
  //     );
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImageUri(result.assets[0].uri);
  //   }
  // };

  // const showImagePicker = () => {
  //   Alert.alert("Select Image", "Choose an option", [
  //     { text: "Camera", onPress: takePhoto },
  //     { text: "Gallery", onPress: pickImage },
  //     { text: "Cancel", style: "cancel" },
  //   ]);
  // };

  // const removeImage = () => {
  //   setImageUri(null);
  // };

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        {/* Category Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !categoryId && styles.placeholderText,
              ]}
            >
              {selectedCategoryName || "Select category"}
            </Text>
            <AntDesign name="down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Note</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            placeholderTextColor="#C4C4C4"
          />
        </View>

        {/* Date Input */}
        <View style={styles.inputGroup}>
          <DateInput
            label="Date"
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select date"
            containerStyle={styles.dateInputContainer}
            inputStyle={styles.dateInput}
            textStyle={styles.dateInputText}
          />
        </View>

        {/* Wallet Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Wallet</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowWalletModal(true)}
          >
            <Text
              style={[styles.dropdownText, !walletId && styles.placeholderText]}
            >
              {selectedWalletName || "Select wallet"}
            </Text>
            <AntDesign name="down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Attach Image */}
        {/* <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Attach Image</Text>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.attachedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <AntDesign name="close" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.attachButton}
              onPress={showImagePicker}
            >
              <Ionicons name="camera-outline" size={24} color="#666" />
              <Text style={styles.attachButtonText}>Add attachment</Text>
            </TouchableOpacity>
          )}
        </View> */}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: buttonColor }]}
        onPress={onSave}
      >
        <Text style={styles.saveButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categoryOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setCategoryId(item.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        visible={showWalletModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wallet</Text>
              <TouchableOpacity onPress={() => setShowWalletModal(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {walletOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setWalletId(item.id);
                    setShowWalletModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FAFAFA",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    color: "#C4C4C4",
  },
  attachButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
  attachButtonText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  imageContainer: {
    position: "relative",
  },
  attachedImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
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
  },
  modalItemText: {
    fontSize: 16,
    color: "#000",
  },
  dateInputContainer: {
    marginBottom: 0,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FAFAFA",
  },
  dateInputText: {
    fontSize: 16,
    color: "#000",
  },
});

export default TransactionForm;
