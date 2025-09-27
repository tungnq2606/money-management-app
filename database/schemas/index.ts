import Realm from "realm";
import { Budget } from "./Budget";
import { Category } from "./Category";
import { Notification } from "./Notification";
import { Transaction } from "./Transaction";
import { User } from "./User";
import { Wallet } from "./Wallet";

// Export all schemas
export { Budget, Category, Notification, Transaction, User, Wallet };

// Consolidated schema array
export const realmSchemas = [
  Budget,
  Category,
  Notification,
  Transaction,
  User,
  Wallet,
];

// Realm configuration
export const realmConfig: Realm.Configuration = {
  schema: realmSchemas,
  schemaVersion: 8,
};
