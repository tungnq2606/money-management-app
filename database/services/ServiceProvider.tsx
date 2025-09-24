import { useRealm } from "@realm/react";
import React, { createContext, ReactNode, useContext } from "react";
import BudgetService from "./BudgetService";
import CategoryService from "./CategoryService";
import NotificationService from "./NotificationService";
import TransactionService from "./TransactionService";
import UserService from "./UserService";
import WalletService from "./WalletService";

interface Services {
  userService: UserService;
  walletService: WalletService;
  categoryService: CategoryService;
  transactionService: TransactionService;
  budgetService: BudgetService;
  notificationService: NotificationService;
}

const ServiceContext = createContext<Services | null>(null);

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  children,
}) => {
  const realm = useRealm();

  const services: Services = {
    userService: new UserService(realm),
    walletService: new WalletService(realm),
    categoryService: new CategoryService(realm),
    transactionService: new TransactionService(realm),
    budgetService: new BudgetService(realm),
    notificationService: new NotificationService(realm),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): Services => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};

// Individual service hooks
export const useUserService = () => useServices().userService;
export const useWalletService = () => useServices().walletService;
export const useCategoryService = () => useServices().categoryService;
export const useTransactionService = () => useServices().transactionService;
export const useBudgetService = () => useServices().budgetService;
export const useNotificationService = () => useServices().notificationService;
