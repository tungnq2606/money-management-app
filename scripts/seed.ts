/*
  Seed script for initializing Realm with sample data that matches the current schemas.
  Run with: npx tsx scripts/seed.ts [init|reset]
*/

import Realm from "realm";
import { realmConfig } from "../database/schemas";

async function openRealm(): Promise<Realm> {
  return Realm.open(realmConfig);
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

async function resetAll(): Promise<void> {
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

async function seedInitialData(): Promise<void> {
  const realm = await openRealm();
  const now = new Date();

  realm.write(() => {
    // User
    const userId = uid("user");
    realm.create("User", {
      id: userId,
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
    const walletId = uid("wallet");
    realm.create("Wallet", {
      id: walletId,
      userId,
      name: "Main Wallet",
      type: "cash",
      amount: 1000,
      toDate: now,
      fromDate: now,
      createdAt: now,
      updateAt: now,
    });

    // Categories
    const incomeCategoryId = uid("cat");
    const expenseCategoryId = uid("cat");
    realm.create("Category", {
      id: incomeCategoryId,
      name: "Salary",
      userId,
      parentId: "",
      type: "income",
      createdAt: now,
      updateAt: now,
    });
    realm.create("Category", {
      id: expenseCategoryId,
      name: "Food & Dining",
      userId,
      parentId: "",
      type: "expense",
      createdAt: now,
      updateAt: now,
    });

    // Budget
    const budgetId = uid("budget");
    realm.create("Budget", {
      id: budgetId,
      name: "Monthly Food",
      walletId: [walletId],
      categoryId: expenseCategoryId,
      amount: 300,
      remain: 300,
      loop: true,
      toDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
      note: "Initial monthly food budget",
      createdAt: now,
      updateAt: now,
    });

    // Transactions
    const txIncomeId = uid("tx");
    const txExpenseId = uid("tx");
    realm.create("Transaction", {
      id: txIncomeId,
      walletId,
      categoryId: incomeCategoryId,
      amount: 2000,
      type: "income",
      note: "Salary",
      createdAt: now,
      updatedAt: now,
    });
    realm.create("Transaction", {
      id: txExpenseId,
      walletId,
      categoryId: expenseCategoryId,
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

async function main() {
  const cmd = process.argv[2] || "init";
  if (cmd === "reset") {
    await resetAll();
    return;
  }
  if (cmd === "init") {
    await seedInitialData();
    return;
  }
  console.log("Unknown command. Use: init | reset");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
