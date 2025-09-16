import BudgetService from "./BudgetService";
import CategoryService from "./CategoryService";
import NotificationService from "./NotificationService";
import RealmService from "./RealmService";
import TransactionService from "./TransactionService";
import UserService from "./UserService";
import WalletService from "./WalletService";

// Initialize database service
let isInitialized = false;
let serviceInstances: {
  userService?: UserService;
  walletService?: WalletService;
  categoryService?: CategoryService;
  transactionService?: TransactionService;
  budgetService?: BudgetService;
  notificationService?: NotificationService;
} = {};

export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    await RealmService.getInstance().initialize();

    // Initialize services after database is ready
    serviceInstances.userService = new UserService();
    serviceInstances.walletService = new WalletService();
    serviceInstances.categoryService = new CategoryService();
    serviceInstances.transactionService = new TransactionService();
    serviceInstances.budgetService = new BudgetService();
    serviceInstances.notificationService = new NotificationService();

    isInitialized = true;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Export service getters that ensure initialization
export const getUserService = (): UserService => {
  if (!isInitialized || !serviceInstances.userService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.userService;
};

export const getWalletService = (): WalletService => {
  if (!isInitialized || !serviceInstances.walletService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.walletService;
};

export const getCategoryService = (): CategoryService => {
  if (!isInitialized || !serviceInstances.categoryService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.categoryService;
};

export const getTransactionService = (): TransactionService => {
  if (!isInitialized || !serviceInstances.transactionService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.transactionService;
};

export const getBudgetService = (): BudgetService => {
  if (!isInitialized || !serviceInstances.budgetService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.budgetService;
};

export const getNotificationService = (): NotificationService => {
  if (!isInitialized || !serviceInstances.notificationService) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return serviceInstances.notificationService;
};

// Export service classes for type checking
export {
  BudgetService,
  CategoryService,
  NotificationService,
  RealmService,
  TransactionService,
  UserService,
  WalletService,
};

// Export types
export type { CreateUserData, SignInData } from "./UserService";

export type { CreateWalletData } from "./WalletService";

export type { CreateCategoryData } from "./CategoryService";

export type { CreateTransactionData } from "./TransactionService";

export type { CreateBudgetData } from "./BudgetService";

export type { CreateNotificationData } from "./NotificationService";
