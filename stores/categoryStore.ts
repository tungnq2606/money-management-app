import { databaseService } from "@/database/databaseService";
import { Category } from "@/database/schemas";
import { create } from "zustand";

export interface CategoryData {
  _id: string;
  userId: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryState {
  categories: CategoryData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: (userId: string, type?: string) => Promise<void>;
  createCategory: (
    userId: string,
    name: string,
    type: string,
    color?: string,
    icon?: string
  ) => Promise<boolean>;
  refreshCategories: (userId: string) => Promise<void>;
}

const convertRealmCategoryToData = (category: Category): CategoryData => ({
  _id: category._id.toString(),
  userId: category.userId,
  name: category.name,
  type: category.type,
  color: category.color,
  icon: category.icon,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (userId: string, type?: string) => {
    try {
      set({ isLoading: true, error: null });

      const realmCategories = databaseService.getUserCategories(userId, type);
      const categories = Array.from(realmCategories).map(
        convertRealmCategoryToData
      );

      set({ categories, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch categories";
      console.error("Fetch categories error:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createCategory: async (
    userId: string,
    name: string,
    type: string,
    color = "#007AFF",
    icon = "circle"
  ) => {
    try {
      set({ error: null });

      databaseService.createCategory(userId, name, type, color, icon);

      // Refresh categories list
      await get().fetchCategories(userId);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      console.error("Create category error:", errorMessage);
      set({ error: errorMessage });
      return false;
    }
  },

  refreshCategories: async (userId: string) => {
    await get().fetchCategories(userId);
  },
}));
