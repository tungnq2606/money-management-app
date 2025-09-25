import HeaderApp from "@/components/HeaderApp";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getGlobalCategoryService } from "../database/services";
import { useAuthStore } from "../stores/authStore";

const AddCategoryScreen = () => {
  const params = useLocalSearchParams<{
    edit?: string;
    categoryId?: string;
    name?: string;
    type?: "income" | "expense";
  }>();

  const [categoryName, setCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense"
  );
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isEditMode = params.edit === "true";

  useEffect(() => {
    if (isEditMode && params.name && params.type) {
      setCategoryName(params.name);
      setSelectedType(params.type);
    }
  }, [isEditMode, params]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You need to login to add category");
      return;
    }

    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter category name");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && params.categoryId) {
        // Update existing category
        const success = getGlobalCategoryService().updateCategory(
          params.categoryId,
          {
            name: categoryName.trim(),
            type: selectedType,
            userId: user._id.toString(),
            parentId: "",
          }
        );

        if (success) {
          Alert.alert("Success", "Category has been updated!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        } else {
          Alert.alert("Error", "Unable to update category");
        }
      } else {
        // Create new category
        const newCategory = getGlobalCategoryService().createCategory({
          name: categoryName.trim(),
          userId: user._id.toString(),
          parentId: "",
          type: selectedType,
        });

        if (newCategory) {
          Alert.alert("Success", "Category has been created!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        } else {
          Alert.alert("Error", "Unable to create category");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      Alert.alert("Error", "An error occurred while saving category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <HeaderApp
        title={isEditMode ? "Edit Category" : "Add Category"}
        isBack={true}
      />

      {/* Form */}
      <View style={styles.form}>
        {/* Category Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category Name</Text>
          <TextInput
            style={styles.textInput}
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="Enter category name"
            placeholderTextColor="#8E8E93"
            maxLength={50}
          />
        </View>

        {/* Type Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "expense" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("expense")}
            >
              <View style={styles.typeButtonContent}>
                <View style={[styles.typeIcon, { backgroundColor: "#FD3C4A" }]}>
                  <AntDesign name="minus" size={16} color="#FFFFFF" />
                </View>
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === "expense" && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "income" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("income")}
            >
              <View style={styles.typeButtonContent}>
                <View style={[styles.typeIcon, { backgroundColor: "#00A86B" }]}>
                  <AntDesign name="plus" size={16} color="#FFFFFF" />
                </View>
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === "income" && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor:
                selectedType === "income" ? "#00A86B" : "#FD3C4A",
            },
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update"
              : "Create Category"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FFFFFF",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  typeButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  typeButtonContent: {
    alignItems: "center",
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  typeButtonTextActive: {
    color: "#007AFF",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddCategoryScreen;
