import Realm from "realm";
import { Account } from "./Account";
import { Budget } from "./Budget";
import { Category } from "./Category";
import { Transaction } from "./Transaction";
import { User } from "./User";

// Export all schemas
export { Account, Budget, Category, Transaction, User };

// Consolidated schema array
export const realmSchemas = [User, Account, Category, Transaction, Budget];

// Realm configuration
export const realmConfig: Realm.Configuration = {
  schema: realmSchemas,
  schemaVersion: 1,
};
