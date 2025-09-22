import Realm from "realm";
import { Category } from "../schemas/Category";
import RealmService from "./RealmService";

export interface CreateCategoryData {
  name: string;
  userId: string;
  parentId: string;
  type: "income" | "expense";
}

class CategoryService {
  private realm: Realm;

  constructor() {
    this.realm = RealmService.getInstance().getRealm();
  }

  createCategory(categoryData: CreateCategoryData): Category {
    try {
      const now = new Date();
      const category = this.realm.write(() => {
        return this.realm.create<Category>("Category", {
          _id: new Realm.BSON.ObjectId(),
          name: categoryData.name,
          userId: categoryData.userId,
          parentId: categoryData.parentId,
          type: categoryData.type,
          createdAt: now,
          updatedAt: now,
        });
      });

      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  getCategoriesByUserId(userId: string): Category[] {
    try {
      return Array.from(
        this.realm
          .objects<Category>("Category")
          .filtered("userId == $0", userId)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting categories by user ID:", error);
      throw error;
    }
  }

  getCategoriesByType(userId: string, type: "income" | "expense"): Category[] {
    try {
      return Array.from(
        this.realm
          .objects<Category>("Category")
          .filtered("userId == $0 AND type == $1", userId, type)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting categories by type:", error);
      throw error;
    }
  }

  getCategoryById(categoryId: string): Category | null {
    try {
      const category = this.realm
        .objects<Category>("Category")
        .filtered("_id == $0", new Realm.BSON.ObjectId(categoryId))[0];

      return category || null;
    } catch (error) {
      console.error("Error getting category by ID:", error);
      throw error;
    }
  }

  updateCategory(
    categoryId: string,
    updateData: Partial<CreateCategoryData>
  ): Category | null {
    try {
      const category = this.getCategoryById(categoryId);
      if (!category) return null;

      this.realm.write(() => {
        if (updateData.name) category.name = updateData.name;
        if (updateData.parentId) category.parentId = updateData.parentId;
        if (updateData.type) category.type = updateData.type;
        category.updatedAt = new Date();
      });

      return category;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  deleteCategory(categoryId: string): boolean {
    try {
      const category = this.getCategoryById(categoryId);
      if (!category) return false;

      this.realm.write(() => {
        this.realm.delete(category);
      });

      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Helper method to create default categories for a new user
  createDefaultCategories(userId: string): void {
    try {
      const defaultIncomeCategories = [
        { name: "Salary", parentId: "" },
        { name: "Business", parentId: "" },
        { name: "Investment", parentId: "" },
        { name: "Other Income", parentId: "" },
      ];

      const defaultExpenseCategories = [
        { name: "Food & Dining", parentId: "" },
        { name: "Transportation", parentId: "" },
        { name: "Shopping", parentId: "" },
        { name: "Entertainment", parentId: "" },
        { name: "Bills & Utilities", parentId: "" },
        { name: "Healthcare", parentId: "" },
        { name: "Education", parentId: "" },
        { name: "Other Expenses", parentId: "" },
      ];

      // Create income categories
      defaultIncomeCategories.forEach((cat) => {
        this.createCategory({
          name: cat.name,
          userId,
          parentId: cat.parentId,
          type: "income",
        });
      });

      // Create expense categories
      defaultExpenseCategories.forEach((cat) => {
        this.createCategory({
          name: cat.name,
          userId,
          parentId: cat.parentId,
          type: "expense",
        });
      });
    } catch (error) {
      console.error("Error creating default categories:", error);
      throw error;
    }
  }

  getAllCategories(): Category[] {
    try {
      return Array.from(
        this.realm.objects<Category>("Category").sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting all categories:", error);
      throw error;
    }
  }
}

export default CategoryService;
