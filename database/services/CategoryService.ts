import { Category } from "../schemas/Category";
import { BaseService } from "./BaseService";

export interface CreateCategoryData {
  name: string;
  userId: string;
  parentId: string;
  type: "income" | "expense";
}

export interface UpdateCategoryData {
  name?: string;
  userId?: string;
  parentId?: string;
  type?: "income" | "expense";
}

export class CategoryService extends BaseService {
  protected schemaName = "Category";

  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    return this.create<Category>(categoryData);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.findById<Category>(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.findAll<Category>();
  }

  async getCategoriesByUser(userId: string): Promise<Category[]> {
    return this.findByFilter<Category>(`userId == "${userId}"`);
  }

  async getCategoriesByType(type: "income" | "expense"): Promise<Category[]> {
    return this.findByFilter<Category>(`type == "${type}"`);
  }

  async getCategoriesByUserAndType(
    userId: string,
    type: "income" | "expense"
  ): Promise<Category[]> {
    return this.findByFilter<Category>(
      `userId == "${userId}" AND type == "${type}"`
    );
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    return this.findByFilter<Category>(`parentId == "${parentId}"`);
  }

  async getRootCategories(userId: string): Promise<Category[]> {
    return this.findByFilter<Category>(
      `userId == "${userId}" AND parentId == ""`
    );
  }

  async updateCategory(
    id: string,
    updates: UpdateCategoryData
  ): Promise<Category | null> {
    return this.update<Category>(id, updates);
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Note: You might want to add logic to handle child categories when deleting a parent
    return this.delete(id);
  }

  async searchCategoriesByName(
    name: string,
    userId?: string
  ): Promise<Category[]> {
    const filter = userId
      ? `name CONTAINS[c] "${name}" AND userId == "${userId}"`
      : `name CONTAINS[c] "${name}"`;
    return this.findByFilter<Category>(filter);
  }

  async getIncomeCategories(userId: string): Promise<Category[]> {
    return this.getCategoriesByUserAndType(userId, "income");
  }

  async getExpenseCategories(userId: string): Promise<Category[]> {
    return this.getCategoriesByUserAndType(userId, "expense");
  }

  async getCategoryHierarchy(userId: string): Promise<Category[]> {
    // Returns all categories for a user, can be used to build a tree structure
    return this.getCategoriesByUser(userId);
  }

  async hasCategoryChildren(categoryId: string): Promise<boolean> {
    const children = await this.getChildCategories(categoryId);
    return children.length > 0;
  }
}
