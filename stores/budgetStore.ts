import { create } from "zustand";
import { Budget } from "../database/schemas/Budget";
import { getGlobalBudgetService } from "../database/services";
import { CreateBudgetData } from "../database/services/BudgetService";

interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
}

interface BudgetActions {
  loadBudgetsByWallet: (walletId: string) => Promise<void>;
  loadBudgetsByCategory: (categoryId: string) => Promise<void>;
  loadActiveBudgets: () => Promise<void>;
  loadAllBudgets: () => Promise<void>;
  createBudget: (budgetData: CreateBudgetData) => Promise<boolean>;
  updateBudget: (
    budgetId: string,
    updateData: Partial<CreateBudgetData>
  ) => Promise<boolean>;
  updateBudgetRemain: (budgetId: string, remain: number) => Promise<boolean>;
  deleteBudget: (budgetId: string) => Promise<boolean>;
  selectBudget: (budget: Budget | null) => void;
  clearBudgets: () => void;
  clearError: () => void;
}

type BudgetStore = BudgetState & BudgetActions;

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  // Initial state
  budgets: [] as Budget[],
  selectedBudget: null,
  isLoading: false,
  error: null,

  // Actions
  loadBudgetsByWallet: async (walletId: string) => {
    set({ isLoading: true, error: null });

    try {
      const budgets = getGlobalBudgetService().getBudgetsByWalletId(walletId);
      set({ budgets, isLoading: false });
    } catch (error) {
      console.error("Load budgets by wallet error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load budgets",
        isLoading: false,
      });
    }
  },

  loadBudgetsByCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });

    try {
      const budgets =
        getGlobalBudgetService().getBudgetsByCategoryId(categoryId);
      set({ budgets, isLoading: false });
    } catch (error) {
      console.error("Load budgets by category error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load budgets",
        isLoading: false,
      });
    }
  },

  loadActiveBudgets: async () => {
    set({ isLoading: true, error: null });

    try {
      const budgets = getGlobalBudgetService().getActiveBudgets();
      set({ budgets, isLoading: false });
    } catch (error) {
      console.error("Load active budgets error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load budgets",
        isLoading: false,
      });
    }
  },

  loadAllBudgets: async () => {
    set({ isLoading: true, error: null });

    try {
      const budgets = getGlobalBudgetService().getAllBudgets();
      set({ budgets, isLoading: false });
    } catch (error) {
      console.error("Load all budgets error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load budgets",
        isLoading: false,
      });
    }
  },

  createBudget: async (budgetData: CreateBudgetData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const budget = getGlobalBudgetService().createBudget(budgetData);
      const { budgets } = get();
      set({ budgets: [budget, ...budgets], isLoading: false });
      return true;
    } catch (error) {
      console.error("Create budget error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to create budget",
        isLoading: false,
      });
      return false;
    }
  },

  updateBudget: async (
    budgetId: string,
    updateData: Partial<CreateBudgetData>
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const updated = getGlobalBudgetService().updateBudget(
        budgetId,
        updateData
      );

      if (updated) {
        const { budgets, selectedBudget } = get();
        const updatedBudgets = budgets.map((b) =>
          b._id.toString() === budgetId ? updated : b
        );

        set({
          budgets: updatedBudgets,
          selectedBudget:
            selectedBudget?._id.toString() === budgetId
              ? updated
              : selectedBudget,
          isLoading: false,
        });
        return true;
      } else {
        set({ error: "Budget not found", isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Update budget error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to update budget",
        isLoading: false,
      });
      return false;
    }
  },

  updateBudgetRemain: async (
    budgetId: string,
    remain: number
  ): Promise<boolean> => {
    try {
      const updated = getGlobalBudgetService().updateBudgetRemain(
        budgetId,
        remain
      );
      if (updated) {
        const { budgets, selectedBudget } = get();
        const updatedBudgets = budgets.map((b) =>
          b._id.toString() === budgetId ? updated : b
        );
        set({
          budgets: updatedBudgets,
          selectedBudget:
            selectedBudget?._id.toString() === budgetId
              ? updated
              : selectedBudget,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update budget remain error:", error);
      return false;
    }
  },

  deleteBudget: async (budgetId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const success = getGlobalBudgetService().deleteBudget(budgetId);

      if (success) {
        const { budgets, selectedBudget } = get();
        const updatedBudgets = budgets.filter(
          (b) => b._id.toString() !== budgetId
        );

        set({
          budgets: updatedBudgets,
          selectedBudget:
            selectedBudget?._id.toString() === budgetId ? null : selectedBudget,
          isLoading: false,
        });
        return true;
      } else {
        set({ error: "Budget not found", isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Delete budget error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete budget",
        isLoading: false,
      });
      return false;
    }
  },

  selectBudget: (budget: Budget | null) => {
    set({ selectedBudget: budget });
  },

  clearBudgets: () => {
    set({ budgets: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
