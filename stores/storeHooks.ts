import { CreateBudgetData } from "../database/services/BudgetService";
import { CreateTransactionData } from "../database/services/TransactionService";
import { CreateUserData } from "../database/services/UserService";
import { CreateWalletData } from "../database/services/WalletService";
import { useAuthStore } from "./authStore";
import { useBudgetStore } from "./budgetStore";
import { useTransactionStore } from "./transactionStore";
import { useWalletStore } from "./walletStore";

// Auth store with services injected
export const useAuthActions = () => {
  const store = useAuthStore();

  return {
    ...store,
    signIn: async (email: string, password: string) => {
      return await store.signIn(email, password);
    },
    signUp: async (userData: CreateUserData) => {
      return await store.signUp(userData);
    },
    updateUser: async (userData: Partial<CreateUserData>) => {
      return await store.updateUser(userData);
    },
  };
};

// Wallet store with services injected
export const useWalletActions = () => {
  const store = useWalletStore();

  return {
    ...store,
    loadWallets: async (userId: string) => {
      return await store.loadWallets(userId);
    },
    createWallet: async (walletData: CreateWalletData) => {
      return await store.createWallet(walletData);
    },
    updateWallet: async (
      walletId: string,
      updateData: Partial<CreateWalletData>
    ) => {
      return await store.updateWallet(walletId, updateData);
    },
    updateWalletAmount: async (walletId: string, amount: number) => {
      return await store.updateWalletAmount(walletId, amount);
    },
    deleteWallet: async (walletId: string) => {
      return await store.deleteWallet(walletId);
    },
  };
};

// Transaction store with services injected
export const useTransactionActions = () => {
  const store = useTransactionStore();

  return {
    ...store,
    loadTransactionsByWallet: async (walletId: string) => {
      return await store.loadTransactionsByWallet(walletId);
    },
    loadTransactionsByCategory: async (categoryId: string) => {
      return await store.loadTransactionsByCategory(categoryId);
    },
    loadTransactionsByType: async (type: "income" | "expense") => {
      return await store.loadTransactionsByType(type);
    },
    loadTransactionsWithFilters: async (filters: any) => {
      return await store.loadTransactionsWithFilters(filters);
    },
    createTransaction: async (transactionData: CreateTransactionData) => {
      return await store.createTransaction(transactionData);
    },
    updateTransaction: async (
      transactionId: string,
      updateData: Partial<CreateTransactionData>
    ) => {
      return await store.updateTransaction(transactionId, updateData);
    },
    deleteTransaction: async (transactionId: string) => {
      return await store.deleteTransaction(transactionId);
    },
    refreshTransactions: async () => {
      return await store.refreshTransactions();
    },
    getTransactionById: (id: string) => {
      return store.getTransactionById(id);
    },
  };
};

// Budget store with services injected
export const useBudgetActions = () => {
  const store = useBudgetStore();

  return {
    ...store,
    loadBudgetsByWallet: async (walletId: string) => {
      return await store.loadBudgetsByWallet(walletId);
    },
    loadBudgetsByCategory: async (categoryId: string) => {
      return await store.loadBudgetsByCategory(categoryId);
    },
    loadActiveBudgets: async () => {
      return await store.loadActiveBudgets();
    },
    loadAllBudgets: async () => {
      return await store.loadAllBudgets();
    },
    createBudget: async (budgetData: CreateBudgetData) => {
      return await store.createBudget(budgetData);
    },
    updateBudget: async (
      budgetId: string,
      updateData: Partial<CreateBudgetData>
    ) => {
      return await store.updateBudget(budgetId, updateData);
    },
    updateBudgetRemain: async (budgetId: string, remain: number) => {
      return await store.updateBudgetRemain(budgetId, remain);
    },
    deleteBudget: async (budgetId: string) => {
      return await store.deleteBudget(budgetId);
    },
  };
};
