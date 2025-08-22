import { databaseService } from "@/database/databaseService";
import { Transaction } from "@/database/schemas";
import { create } from "zustand";

export interface TransactionData {
  _id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionState {
  transactions: TransactionData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: (userId: string, limit?: number) => Promise<void>;
  fetchAccountTransactions: (
    accountId: string,
    limit?: number
  ) => Promise<void>;
  createTransaction: (
    userId: string,
    accountId: string,
    categoryId: string,
    amount: number,
    type: string,
    description?: string,
    date?: Date
  ) => Promise<boolean>;
  refreshTransactions: (userId: string) => Promise<void>;
}

const convertRealmTransactionToData = (
  transaction: Transaction
): TransactionData => ({
  _id: transaction._id.toString(),
  userId: transaction.userId,
  accountId: transaction.accountId,
  categoryId: transaction.categoryId,
  amount: transaction.amount,
  type: transaction.type,
  description: transaction.description,
  date: transaction.date,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async (userId: string, limit?: number) => {
    try {
      set({ isLoading: true, error: null });

      const realmTransactions = databaseService.getUserTransactions(
        userId,
        limit
      );
      const transactions = Array.isArray(realmTransactions)
        ? realmTransactions.map(convertRealmTransactionToData)
        : Array.from(realmTransactions).map(convertRealmTransactionToData);

      set({ transactions, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch transactions";
      console.error("Fetch transactions error:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchAccountTransactions: async (accountId: string, limit?: number) => {
    try {
      set({ isLoading: true, error: null });

      const realmTransactions = databaseService.getAccountTransactions(
        accountId,
        limit
      );
      const transactions = Array.isArray(realmTransactions)
        ? realmTransactions.map(convertRealmTransactionToData)
        : Array.from(realmTransactions).map(convertRealmTransactionToData);

      set({ transactions, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch account transactions";
      console.error("Fetch account transactions error:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createTransaction: async (
    userId: string,
    accountId: string,
    categoryId: string,
    amount: number,
    type: string,
    description = "",
    date = new Date()
  ) => {
    try {
      set({ error: null });

      databaseService.createTransaction(
        userId,
        accountId,
        categoryId,
        amount,
        type,
        description,
        date
      );

      // Refresh transactions list
      await get().fetchTransactions(userId);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create transaction";
      console.error("Create transaction error:", errorMessage);
      set({ error: errorMessage });
      return false;
    }
  },

  refreshTransactions: async (userId: string) => {
    await get().fetchTransactions(userId);
  },
}));
