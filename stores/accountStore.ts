import { databaseService } from "@/database/databaseService";
import { Account } from "@/database/schemas";
import { create } from "zustand";

export interface AccountData {
  _id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AccountState {
  accounts: AccountData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAccounts: (userId: string) => Promise<void>;
  createAccount: (
    userId: string,
    name: string,
    type: string,
    initialBalance?: number,
    currency?: string
  ) => Promise<boolean>;
  updateAccountBalance: (
    accountId: string,
    newBalance: number
  ) => Promise<void>;
  refreshAccounts: (userId: string) => Promise<void>;
}

const convertRealmAccountToData = (account: Account): AccountData => ({
  _id: account._id.toString(),
  userId: account.userId,
  name: account.name,
  type: account.type,
  balance: account.balance,
  currency: account.currency,
  isActive: account.isActive,
  createdAt: account.createdAt,
  updatedAt: account.updatedAt,
});

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,

  fetchAccounts: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const realmAccounts = databaseService.getUserAccounts(userId);
      const accounts = Array.from(realmAccounts).map(convertRealmAccountToData);

      set({ accounts, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch accounts";
      console.error("Fetch accounts error:", errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createAccount: async (
    userId: string,
    name: string,
    type: string,
    initialBalance = 0,
    currency = "USD"
  ) => {
    try {
      set({ error: null });

      const newAccount = databaseService.createAccount(
        userId,
        name,
        type,
        initialBalance,
        currency
      );

      // Refresh accounts list
      await get().fetchAccounts(userId);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      console.error("Create account error:", errorMessage);
      set({ error: errorMessage });
      return false;
    }
  },

  updateAccountBalance: async (accountId: string, newBalance: number) => {
    try {
      set({ error: null });

      databaseService.updateAccountBalance(accountId, newBalance);

      // Update local state
      const { accounts } = get();
      const updatedAccounts = accounts.map((account) =>
        account._id === accountId
          ? { ...account, balance: newBalance, updatedAt: new Date() }
          : account
      );

      set({ accounts: updatedAccounts });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update account balance";
      console.error("Update account balance error:", errorMessage);
      set({ error: errorMessage });
    }
  },

  refreshAccounts: async (userId: string) => {
    await get().fetchAccounts(userId);
  },
}));
