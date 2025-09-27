import { useRealm } from "@realm/react";
import Realm from "realm";
import { realmConfig } from "../schemas";
import BudgetService from "./BudgetService";
import CategoryService from "./CategoryService";
import NotificationService from "./NotificationService";
import TransactionService from "./TransactionService";
import UserService from "./UserService";
import WalletService from "./WalletService";

// Hook to get all services with realm instance
export const useServices = () => {
  const realm = useRealm();

  return {
    userService: new UserService(realm),
    walletService: new WalletService(realm),
    categoryService: new CategoryService(realm),
    transactionService: new TransactionService(realm),
    budgetService: new BudgetService(realm),
    notificationService: new NotificationService(realm),
  };
};

// Individual service hooks for convenience
export const useUserService = () => {
  const realm = useRealm();
  return new UserService(realm);
};

export const useWalletService = () => {
  const realm = useRealm();
  return new WalletService(realm);
};

export const useCategoryService = () => {
  const realm = useRealm();
  return new CategoryService(realm);
};

export const useTransactionService = () => {
  const realm = useRealm();
  return new TransactionService(realm);
};

export const useBudgetService = () => {
  const realm = useRealm();
  return new BudgetService(realm);
};

export const useNotificationService = () => {
  const realm = useRealm();
  return new NotificationService(realm);
};

// Global realm instance for stores (simple approach)
let globalRealm: Realm | null = null;

// Initialize global realm
export const initializeGlobalRealm = () => {
  if (!globalRealm) {
    globalRealm = new Realm(realmConfig);
  }
  return globalRealm;
};

// Get global realm instance
const getGlobalRealm = (): Realm => {
  if (!globalRealm) {
    globalRealm = initializeGlobalRealm();
  }
  return globalRealm;
};

// Global service getters that use the global realm
export const getGlobalUserService = (): UserService => {
  return new UserService(getGlobalRealm());
};

export const getGlobalWalletService = (): WalletService => {
  return new WalletService(getGlobalRealm());
};

export const getGlobalCategoryService = (): CategoryService => {
  return new CategoryService(getGlobalRealm());
};

export const getGlobalTransactionService = (): TransactionService => {
  return new TransactionService(getGlobalRealm());
};

export const getGlobalBudgetService = (): BudgetService => {
  return new BudgetService(getGlobalRealm());
};

export const getGlobalNotificationService = (): NotificationService => {
  return new NotificationService(getGlobalRealm());
};

// Function to delete all data except user data
export const deleteAllDataExceptUser = (userId: string): void => {
  try {
    const realm = getGlobalRealm();

    realm.write(() => {
      // Delete all transactions except user's
      const userWallets = realm
        .objects("Wallet")
        .filtered("userId == $0", userId);

      const userWalletIds = Array.from(userWallets).map((wallet: any) =>
        wallet._id.toString()
      );

      const transactionsToDelete = realm
        .objects("Transaction")
        .filtered("NOT walletId IN $0", userWalletIds);
      realm.delete(transactionsToDelete);

      // Delete all wallets except user's
      const walletsToDelete = realm
        .objects("Wallet")
        .filtered("userId != $0", userId);
      realm.delete(walletsToDelete);

      // Delete all categories except user's
      const categoriesToDelete = realm
        .objects("Category")
        .filtered("userId != $0", userId);
      realm.delete(categoriesToDelete);

      // Delete all budgets except user's
      const budgetsToDelete = realm
        .objects("Budget")
        .filtered("userId != $0", userId);
      realm.delete(budgetsToDelete);

      // Delete all notifications (they are global)
      const notificationsToDelete = realm.objects("Notification");
      realm.delete(notificationsToDelete);
    });

    console.log("All data except user data deleted successfully");
  } catch (error) {
    console.error("Error deleting all data except user:", error);
    throw error;
  }
};

// Export service classes for type checking
export {
  BudgetService,
  CategoryService,
  NotificationService,
  TransactionService,
  UserService,
  WalletService,
};

// Export types
export type { CreateBudgetData } from "./BudgetService";
export type { CreateCategoryData } from "./CategoryService";
export type { CreateNotificationData } from "./NotificationService";
export type { CreateTransactionData } from "./TransactionService";
export type { CreateUserData, SignInData } from "./UserService";
export type { CreateWalletData } from "./WalletService";
