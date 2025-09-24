import { create } from "zustand";
import { Transaction } from "../database/schemas/Transaction";
import {
  getGlobalTransactionService,
  getGlobalWalletService,
} from "../database/services";
import { CreateTransactionData } from "../database/services/TransactionService";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionActions {
  loadTransactionsByWallet: (walletId: string) => Promise<void>;
  loadTransactionsByCategory: (categoryId: string) => Promise<void>;
  loadTransactionsByType: (type: "income" | "expense") => Promise<void>;
  loadTransactionsWithFilters: (filters: {
    walletIds?: string[];
    categoryIds?: string[];
    type?: "income" | "expense";
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) => Promise<void>;
  createTransaction: (
    transactionData: CreateTransactionData
  ) => Promise<boolean>;
  updateTransaction: (
    transactionId: string,
    updateData: Partial<CreateTransactionData>
  ) => Promise<boolean>;
  deleteTransaction: (transactionId: string) => Promise<boolean>;
  clearError: () => void;
  clearTransactions: () => void;
}

type TransactionStore = TransactionState & TransactionActions;

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  // Initial state
  transactions: [],
  isLoading: false,
  error: null,

  // Actions
  loadTransactionsByWallet: async (walletId: string) => {
    set({ isLoading: true, error: null });

    try {
      const transactions =
        getGlobalTransactionService().getTransactionsByWalletId(walletId);
      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      console.error("Load transactions by wallet error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load transactions",
        isLoading: false,
      });
    }
  },

  loadTransactionsByCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });

    try {
      const transactions =
        getGlobalTransactionService().getTransactionsByCategoryId(categoryId);
      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      console.error("Load transactions by category error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load transactions",
        isLoading: false,
      });
    }
  },

  loadTransactionsByType: async (type: "income" | "expense") => {
    set({ isLoading: true, error: null });

    try {
      const transactions =
        getGlobalTransactionService().getTransactionsByType(type);
      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      console.error("Load transactions by type error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load transactions",
        isLoading: false,
      });
    }
  },

  loadTransactionsWithFilters: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const transactions =
        getGlobalTransactionService().getTransactionsWithFilters(filters);
      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      console.error("Load transactions with filters error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load transactions",
        isLoading: false,
      });
    }
  },

  createTransaction: async (
    transactionData: CreateTransactionData
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const transaction =
        getGlobalTransactionService().createTransaction(transactionData);

      // Update wallet amount based on transaction type
      const wallet = getGlobalWalletService().getWalletById(
        transactionData.walletId
      );
      if (wallet) {
        const newAmount =
          transactionData.type === "income"
            ? wallet.amount + transactionData.amount
            : wallet.amount - transactionData.amount;

        getGlobalWalletService().updateWalletAmount(
          transactionData.walletId,
          newAmount
        );
      }

      const { transactions } = get();
      set({
        transactions: [transaction, ...transactions],
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("Create transaction error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
        isLoading: false,
      });
      return false;
    }
  },

  updateTransaction: async (
    transactionId: string,
    updateData: Partial<CreateTransactionData>
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      // Get the original transaction to calculate wallet amount differences
      const originalTransaction =
        getGlobalTransactionService().getTransactionById(transactionId);
      if (!originalTransaction) {
        set({
          error: "Transaction not found",
          isLoading: false,
        });
        return false;
      }

      const updatedTransaction =
        getGlobalTransactionService().updateTransaction(
          transactionId,
          updateData
        );

      if (updatedTransaction) {
        // Update wallet amount if amount or type changed
        if (updateData.amount !== undefined || updateData.type !== undefined) {
          const wallet = getGlobalWalletService().getWalletById(
            updatedTransaction.walletId
          );
          if (wallet) {
            // Reverse the original transaction effect
            const originalEffect =
              originalTransaction.type === "income"
                ? -originalTransaction.amount
                : originalTransaction.amount;

            // Apply the new transaction effect
            const newEffect =
              updatedTransaction.type === "income"
                ? updatedTransaction.amount
                : -updatedTransaction.amount;

            const newAmount = wallet.amount + originalEffect + newEffect;
            getGlobalWalletService().updateWalletAmount(
              updatedTransaction.walletId,
              newAmount
            );
          }
        }

        const { transactions } = get();
        const updatedTransactions = transactions.map((t) =>
          t._id.toString() === transactionId ? updatedTransaction : t
        );

        set({
          transactions: updatedTransactions,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: "Transaction not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Update transaction error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update transaction",
        isLoading: false,
      });
      return false;
    }
  },

  deleteTransaction: async (transactionId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      // Get the transaction to reverse its effect on wallet
      const transaction =
        getGlobalTransactionService().getTransactionById(transactionId);
      if (!transaction) {
        set({
          error: "Transaction not found",
          isLoading: false,
        });
        return false;
      }

      const success =
        getGlobalTransactionService().deleteTransaction(transactionId);

      if (success) {
        // Reverse the transaction effect on wallet
        const wallet = getGlobalWalletService().getWalletById(
          transaction.walletId
        );
        if (wallet) {
          const amountToReverse =
            transaction.type === "income"
              ? -transaction.amount
              : transaction.amount;

          const newAmount = wallet.amount + amountToReverse;
          getGlobalWalletService().updateWalletAmount(
            transaction.walletId,
            newAmount
          );
        }

        const { transactions } = get();
        const updatedTransactions = transactions.filter(
          (t) => t._id.toString() !== transactionId
        );

        set({
          transactions: updatedTransactions,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: "Transaction not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Delete transaction error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete transaction",
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearTransactions: () => {
    set({ transactions: [] });
  },
}));
