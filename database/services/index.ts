// Import service classes
import { BudgetService } from "./BudgetService";
import { CategoryService } from "./CategoryService";
import { NotificationService } from "./NotificationService";
import { TransactionService } from "./TransactionService";
import { UserService } from "./UserService";
import { WalletService } from "./WalletService";

// Export all services
export { BaseService } from "./BaseService";
export { BudgetService } from "./BudgetService";
export { CategoryService } from "./CategoryService";
export { NotificationService } from "./NotificationService";
export { TransactionService } from "./TransactionService";
export { UserService } from "./UserService";
export { WalletService } from "./WalletService";

// Export service interfaces
export type { CreateUserData, UpdateUserData } from "./UserService";

export type { CreateBudgetData, UpdateBudgetData } from "./BudgetService";

export type { CreateCategoryData, UpdateCategoryData } from "./CategoryService";

export type { CreateWalletData, UpdateWalletData } from "./WalletService";

export type {
  CreateTransactionData,
  UpdateTransactionData,
} from "./TransactionService";

export type {
  CreateNotificationData,
  UpdateNotificationData,
} from "./NotificationService";

// Create singleton instances
export const userService = new UserService();
export const budgetService = new BudgetService();
export const categoryService = new CategoryService();
export const walletService = new WalletService();
export const transactionService = new TransactionService();
export const notificationService = new NotificationService();

// Create a collection of all services for easy access
export const services = {
  user: userService,
  budget: budgetService,
  category: categoryService,
  wallet: walletService,
  transaction: transactionService,
  notification: notificationService,
};

// Utility function to close all services
export const closeAllServices = () => {
  Object.values(services).forEach((service) => {
    if (service && typeof service.closeRealm === "function") {
      service.closeRealm();
    }
  });
};
