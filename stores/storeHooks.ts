import { useServices } from "../database/services/ServiceProvider";
import { CreateTransactionData } from "../database/services/TransactionService";
import { CreateUserData } from "../database/services/UserService";
import { CreateWalletData } from "../database/services/WalletService";
import { useAuthStore } from "./authStore";
import { useTransactionStore } from "./transactionStore";
import { useWalletStore } from "./walletStore";

// Auth store with services injected
export const useAuthActions = () => {
  const { userService, categoryService, walletService } = useServices();
  const store = useAuthStore();

  return {
    ...store,
    signIn: async (email: string, password: string) => {
      return await store.signIn(email, password, userService);
    },
    signUp: async (userData: CreateUserData) => {
      return await store.signUp(
        userData,
        userService,
        categoryService,
        walletService
      );
    },
    updateUser: async (userData: Partial<CreateUserData>) => {
      return await store.updateUser(userData, userService);
    },
  };
};

// Wallet store with services injected
export const useWalletActions = () => {
  const { walletService } = useServices();
  const store = useWalletStore();

  return {
    ...store,
    loadWallets: async (userId: string) => {
      return await store.loadWallets(userId, walletService);
    },
    createWallet: async (walletData: CreateWalletData) => {
      return await store.createWallet(walletData, walletService);
    },
    updateWallet: async (
      walletId: string,
      updateData: Partial<CreateWalletData>
    ) => {
      return await store.updateWallet(walletId, updateData, walletService);
    },
    updateWalletAmount: async (walletId: string, amount: number) => {
      return await store.updateWalletAmount(walletId, amount, walletService);
    },
    deleteWallet: async (walletId: string) => {
      return await store.deleteWallet(walletId, walletService);
    },
  };
};

// Transaction store with services injected
export const useTransactionActions = () => {
  const { transactionService, walletService } = useServices();
  const store = useTransactionStore();

  return {
    ...store,
    loadTransactionsByWallet: async (walletId: string) => {
      return await store.loadTransactionsByWallet(walletId, transactionService);
    },
    loadTransactionsByCategory: async (categoryId: string) => {
      return await store.loadTransactionsByCategory(
        categoryId,
        transactionService
      );
    },
    loadTransactionsByType: async (type: "income" | "expense") => {
      return await store.loadTransactionsByType(type, transactionService);
    },
    loadTransactionsWithFilters: async (filters: any) => {
      return await store.loadTransactionsWithFilters(
        filters,
        transactionService
      );
    },
    createTransaction: async (transactionData: CreateTransactionData) => {
      return await store.createTransaction(
        transactionData,
        transactionService,
        walletService
      );
    },
    updateTransaction: async (
      transactionId: string,
      updateData: Partial<CreateTransactionData>
    ) => {
      return await store.updateTransaction(
        transactionId,
        updateData,
        transactionService,
        walletService
      );
    },
    deleteTransaction: async (transactionId: string) => {
      return await store.deleteTransaction(
        transactionId,
        transactionService,
        walletService
      );
    },
  };
};
