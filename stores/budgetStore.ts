import { databaseService } from "@/database/databaseService";
import { Budget } from "@/database/schemas";
import { create } from "zustand";

export interface BudgetData {
  _id: string;
  userId: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetState {
  budgets: BudgetData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBudgets: (userId: string) => Promise<void>;
  createBudget: (
    userId: string,
    categoryId: string,
    amount: number,
    period: string,
    startDate: Date,
    endDate: Date
  ) => Promise<boolean>;
  refreshBudgets: (userId: string) => Promise<void>;
}

const convertRealmBudgetToData = (budget: Budget): BudgetData => ({
  _id: budget._id.toString(),
  userId: budget.userId,
  categoryId: budget.categoryId,
  amount: budget.amount,
  spent: budget.spent,
  period: budget.period,
  startDate: budget.startDate,
  endDate: budget.endDate,
  isActive: budget.isActive,
  createdAt: budget.createdAt,
  updatedAt: budget.updatedAt,
});

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const realmBudgets = databaseService.getUserBudgets(userId);
      const budgets = Array.from(realmBudgets).map(convertRealmBudgetToData);

      set({ budgets, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch budgets";
      console.error("Fetch budgets error:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createBudget: async (
    userId: string,
    categoryId: string,
    amount: number,
    period: string,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      set({ error: null });

      databaseService.createBudget(
        userId,
        categoryId,
        amount,
        period,
        startDate,
        endDate
      );

      // Refresh budgets list
      await get().fetchBudgets(userId);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create budget";
      console.error("Create budget error:", errorMessage);
      set({ error: errorMessage });
      return false;
    }
  },

  refreshBudgets: async (userId: string) => {
    await get().fetchBudgets(userId);
  },
}));
