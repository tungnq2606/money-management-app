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
