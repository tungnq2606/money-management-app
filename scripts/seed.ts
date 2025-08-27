/*
  Seed script for initializing Realm with sample data that matches the current schemas.
  Run with: npx tsx scripts/seed.ts [init|reset]
*/

import Realm from "realm";
import { realmConfig } from "../database/schemas";

async function openRealm(): Promise<Realm> {
  return Realm.open(realmConfig);
}

export async function resetAll(): Promise<void> {
  const realm = await openRealm();
  realm.write(() => {
    for (const schema of realm.schema) {
      const objects = realm.objects(schema.name);
      realm.delete(objects);
    }
  });
  console.log("✅ Cleared all Realm data");
  realm.close();
}

export async function seedInitialData(): Promise<void> {
  const realm = await openRealm();
  const now = new Date();

  realm.write(() => {
    // User
    const userId = new Realm.BSON.ObjectId();
    realm.create("User", {
      _id: userId,
      name: "Demo User",
      birthday: new Date(1995, 5, 15),
      phoneNumber: 84999999999,
      address: "123 Example Street",
      email: "demo@example.com",
      password: "hashed-password",
      createdAt: now,
      updatedAt: now,
    });

    // Wallet
    const walletId = new Realm.BSON.ObjectId();
    realm.create("Wallet", {
      _id: walletId,
      userId: userId.toHexString(),
      name: "Main Wallet",
      type: "cash",
      amount: 1000,
      toDate: now,
      fromDate: now,
      createdAt: now,
      updatedAt: now,
    });

    // Categories
    const incomeCategoryId = new Realm.BSON.ObjectId();
    const expenseCategoryId = new Realm.BSON.ObjectId();
    realm.create("Category", {
      _id: incomeCategoryId,
      name: "Salary",
      userId: userId.toHexString(),
      parentId: "",
      type: "income",
      createdAt: now,
      updatedAt: now,
    });
    realm.create("Category", {
      _id: expenseCategoryId,
      name: "Food & Dining",
      userId: userId.toHexString(),
      parentId: "",
      type: "expense",
      createdAt: now,
      updatedAt: now,
    });

    // Budget
    const budgetId = new Realm.BSON.ObjectId();
    realm.create("Budget", {
      _id: budgetId,
      name: "Monthly Food",
      walletId: [walletId.toHexString()],
      categoryId: expenseCategoryId.toHexString(),
      amount: 300,
      remain: 300,
      loop: true,
      toDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
      note: "Initial monthly food budget",
      createdAt: now,
      updatedAt: now,
    });

    // Transactions
    const txIncomeId = new Realm.BSON.ObjectId();
    const txExpenseId = new Realm.BSON.ObjectId();
    realm.create("Transaction", {
      _id: txIncomeId,
      walletId: walletId.toHexString(),
      categoryId: incomeCategoryId.toHexString(),
      amount: 2000,
      type: "income",
      note: "Salary",
      createdAt: now,
      updatedAt: now,
    });
    realm.create("Transaction", {
      _id: txExpenseId,
      walletId: walletId.toHexString(),
      categoryId: expenseCategoryId.toHexString(),
      amount: 25.5,
      type: "expense",
      note: "Lunch",
      createdAt: now,
      updatedAt: now,
    });

    // Notification (uses ObjectId primary key per schema)
    realm.create("Notification", {
      _id: new Realm.BSON.ObjectId(),
      content: "Welcome to the Money Management App!",
      link: "app://home",
      time: now,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    });
  });

  console.log("✅ Seeded initial data successfully");
  realm.close();
}

