import { create } from "zustand";
import { formatMoney } from "../constants/formatMoney";
import { Transaction } from "../database/schemas/Transaction";
import {
  getGlobalBudgetService,
  getGlobalNotificationService,
  getGlobalTransactionService,
  getGlobalWalletService,
} from "../database/services";
import { CreateTransactionData } from "../database/services/TransactionService";
import { useBudgetStore } from "./budgetStore";

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
  refreshTransactions: () => Promise<void>;
  getTransactionById: (id: string) => Transaction | null;
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

      // If expense, update related budgets' remain and create a notification
      try {
        if (transactionData.type === "expense") {
          const budgetService = getGlobalBudgetService();
          // Find budgets by category first, then filter by wallet inclusion and date range
          const candidateBudgets = budgetService.getBudgetsByCategoryId(
            transactionData.categoryId
          );
          const txDate = transactionData.date || new Date();

          const affectedBudgets = candidateBudgets.filter((b) => {
            const walletMatches = Array.isArray(b.walletId)
              ? b.walletId.includes(transactionData.walletId)
              : false;
            const inRange = txDate >= b.fromDate && txDate <= b.toDate;
            return walletMatches && inRange;
          });

          // Store budget information for return
          const budgetUpdates: {
            budgetName: string;
            oldRemain: number;
            newRemain: number;
            isOverBudget: boolean;
          }[] = [];

          // Update budgets through budget store to ensure UI state is updated
          const { updateBudgetRemain } = useBudgetStore.getState();

          for (const b of affectedBudgets) {
            const oldRemain = b.remain || 0;
            const newRemain = Math.max(0, oldRemain - transactionData.amount);
            const isOverBudget = newRemain === 0 && oldRemain > 0;

            budgetUpdates.push({
              budgetName: b.name,
              oldRemain,
              newRemain,
              isOverBudget,
            });

            // Use budget store to update both database and UI state
            await updateBudgetRemain(b._id.toString(), newRemain);
          }

          // Create notification for the user with budget details
          if (wallet) {
            const notificationService = getGlobalNotificationService();
            let content = `Expense ${formatMoney(
              transactionData.amount
            )} recorded in wallet ${wallet.name}`;

            if (affectedBudgets.length > 0) {
              const budgetDetails = budgetUpdates
                .map((b) => {
                  const status = b.isOverBudget ? " (OVER BUDGET!)" : "";
                  return `${b.budgetName}: ${b.newRemain} remaining${status}`;
                })
                .join(", ");
              content = `Expense ${formatMoney(
                transactionData.amount
              )} applied to budget(s): ${budgetDetails}`;
            }

            notificationService.createNotification({
              content,
              time: new Date(),
              userId: wallet.userId,
            });
          }

          // Store budget information in transaction for potential use
          (transaction as any).budgetUpdates = budgetUpdates;
        } else if (wallet) {
          // For income, optionally notify transaction creation
          const notificationService = getGlobalNotificationService();
          notificationService.createNotification({
            content: `Income ${transactionData.amount} recorded in wallet ${wallet.name}`,
            time: new Date(),
            userId: wallet.userId,
          });
        }
      } catch (notifyOrBudgetError) {
        // Non-fatal: log but do not block transaction creation
        console.error(
          "Post-transaction budget/notification error:",
          notifyOrBudgetError
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

        // Handle budget updates for expense transactions
        if (
          updateData.amount !== undefined ||
          updateData.type !== undefined ||
          updateData.categoryId !== undefined
        ) {
          const budgetService = getGlobalBudgetService();
          const { updateBudgetRemain } = useBudgetStore.getState();

          // Handle original transaction budget impact (reverse it)
          if (originalTransaction.type === "expense") {
            const originalCandidateBudgets =
              budgetService.getBudgetsByCategoryId(
                originalTransaction.categoryId
              );
            const originalTxDate = originalTransaction.date || new Date();

            const originalAffectedBudgets = originalCandidateBudgets.filter(
              (b) => {
                const walletMatches = Array.isArray(b.walletId)
                  ? b.walletId.includes(originalTransaction.walletId)
                  : false;
                const inRange =
                  originalTxDate >= b.fromDate && originalTxDate <= b.toDate;
                return walletMatches && inRange;
              }
            );

            // Reverse the original transaction effect on budgets
            for (const b of originalAffectedBudgets) {
              const currentRemain = b.remain || 0;
              const newRemain = currentRemain + originalTransaction.amount;
              await updateBudgetRemain(b._id.toString(), newRemain);
            }
          }

          // Handle new transaction budget impact
          if (updatedTransaction.type === "expense") {
            const newCandidateBudgets = budgetService.getBudgetsByCategoryId(
              updatedTransaction.categoryId
            );
            const newTxDate = updatedTransaction.date || new Date();

            const newAffectedBudgets = newCandidateBudgets.filter((b) => {
              const walletMatches = Array.isArray(b.walletId)
                ? b.walletId.includes(updatedTransaction.walletId)
                : false;
              const inRange = newTxDate >= b.fromDate && newTxDate <= b.toDate;
              return walletMatches && inRange;
            });

            // Apply the new transaction effect on budgets
            for (const b of newAffectedBudgets) {
              const currentRemain = b.remain || 0;
              const newRemain = Math.max(
                0,
                currentRemain - updatedTransaction.amount
              );
              await updateBudgetRemain(b._id.toString(), newRemain);
            }
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

        // Reverse the transaction effect on budgets if it was an expense
        if (transaction.type === "expense") {
          const budgetService = getGlobalBudgetService();
          const { updateBudgetRemain } = useBudgetStore.getState();

          const candidateBudgets = budgetService.getBudgetsByCategoryId(
            transaction.categoryId
          );
          const txDate = transaction.date || new Date();

          const affectedBudgets = candidateBudgets.filter((b) => {
            const walletMatches = Array.isArray(b.walletId)
              ? b.walletId.includes(transaction.walletId)
              : false;
            const inRange = txDate >= b.fromDate && txDate <= b.toDate;
            return walletMatches && inRange;
          });

          // Reverse the transaction effect on budgets
          for (const b of affectedBudgets) {
            const currentRemain = b.remain || 0;
            const newRemain = currentRemain + transaction.amount;
            await updateBudgetRemain(b._id.toString(), newRemain);
          }
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

  refreshTransactions: async () => {
    const { transactions } = get();
    if (transactions.length === 0) return;

    try {
      set({ isLoading: true, error: null });

      // Reload all transactions
      const allTransactions =
        getGlobalTransactionService().getAllTransactions();

      set({
        transactions: allTransactions,
        isLoading: false,
      });
    } catch (error) {
      console.error("Refresh transactions error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to refresh transactions",
        isLoading: false,
      });
    }
  },

  getTransactionById: (id: string) => {
    const { transactions } = get();
    return transactions.find((t) => t._id.toString() === id) || null;
  },
}));
