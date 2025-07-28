import Realm from "realm";

// User Schema
export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  email!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      email: "string",
      name: "string",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}

// Account Schema (for different bank accounts, wallets, etc.)
export class Account extends Realm.Object<Account> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  name!: string;
  type!: string; // 'checking', 'savings', 'credit', 'cash', 'investment'
  balance!: number;
  currency!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Account",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      type: "string",
      balance: "double",
      currency: { type: "string" as const, default: "USD" },
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}

// Category Schema
export class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  name!: string;
  type!: string; // 'income' or 'expense'
  color!: string;
  icon!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Category",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      type: "string",
      color: { type: "string" as const, default: "#007AFF" },
      icon: { type: "string" as const, default: "circle" },
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}

// Transaction Schema
export class Transaction extends Realm.Object<Transaction> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  accountId!: string;
  categoryId!: string;
  amount!: number;
  type!: string; // 'income', 'expense', 'transfer'
  description!: string;
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      accountId: "string",
      categoryId: "string",
      amount: "double",
      type: "string",
      description: { type: "string" as const, default: "" },
      date: "date",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}

// Budget Schema
export class Budget extends Realm.Object<Budget> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  categoryId!: string;
  amount!: number;
  spent!: number;
  period!: string; // 'monthly', 'weekly', 'yearly'
  startDate!: Date;
  endDate!: Date;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Budget",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      categoryId: "string",
      amount: "double",
      spent: { type: "double" as const, default: 0 },
      period: "string",
      startDate: "date",
      endDate: "date",
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}

export const realmSchemas = [User, Account, Category, Transaction, Budget];

// Realm configuration
export const realmConfig: Realm.Configuration = {
  schema: realmSchemas,
  schemaVersion: 1,
};
