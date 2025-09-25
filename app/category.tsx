import HeaderApp from "@/components/HeaderApp";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Category } from "../database/schemas/Category";
import { getGlobalCategoryService } from "../database/services";
import { useAuthStore } from "../stores/authStore";

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense"
  );
  const user = useAuthStore((s) => s.user);

  const loadCategories = useCallback(() => {
    if (!user) return;

    try {
      const userCategories = getGlobalCategoryService().getCategoriesByType(
        user._id.toString(),
        selectedType
      );
      setCategories(userCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      Alert.alert("Error", "Unable to load category list");
    }
  }, [user, selectedType]);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user, loadCategories]);

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete category "${categoryName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            try {
              const success =
                getGlobalCategoryService().deleteCategory(categoryId);
              if (success) {
                Alert.alert("Success", "Category has been deleted");
                loadCategories();
              } else {
                Alert.alert("Error", "Unable to delete category");
              }
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "An error occurred while deleting category");
            }
          },
        },
      ]
    );
  };

  const handleEditCategory = (category: Category) => {
    router.push({
      pathname: "/addCategory" as any,
      params: {
        edit: "true",
        categoryId: category._id.toString(),
        name: category.name,
        type: category.type,
      },
    });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryType}>
          {item.type === "income" ? "Income" : "Expense"}
        </Text>
      </View>
      <View style={styles.categoryActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditCategory(item)}
        >
          <AntDesign name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item._id.toString(), item.name)}
        >
          <AntDesign name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <AntDesign name="folderopen" size={64} color="#C7C7CC" />
      <Text style={styles.emptyStateText}>
        No categories for {selectedType === "income" ? "income" : "expense"}
      </Text>
      <TouchableOpacity
        style={styles.addFirstButton}
        onPress={() => router.push("/addCategory" as any)}
      >
        <Text style={styles.addFirstButtonText}>Add first category</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <HeaderApp
        title={"Category Management"}
        isBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push("/addCategory" as any)}>
            <AntDesign name="plus" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedType === "expense" && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedType("expense")}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === "expense" && styles.typeButtonTextActive,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedType === "income" && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedType("income")}
        >
          <Text
            style={[
              styles.typeButtonText,
              selectedType === "income" && styles.typeButtonTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  addButton: {
    padding: 8,
  },
  typeSelector: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
  },
  typeButtonTextActive: {
    color: "#007AFF",
  },
  listContainer: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  categoryType: {
    fontSize: 14,
    color: "#8E8E93",
  },
  categoryActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CategoryManagementScreen;
