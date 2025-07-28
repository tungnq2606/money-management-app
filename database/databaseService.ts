import Realm from "realm";
import {
  Account,
  Budget,
  Category,
  realmConfig,
  Transaction,
  User,
} from "./schemas";

class DatabaseService {
  private realm: Realm | null = null;

  async initialize(): Promise<void> {
    try {
      this.realm = await Realm.open(realmConfig);
      console.log("Realm database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Realm database:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
    }
  }

  private ensureRealm(): Realm {
    if (!this.realm) {
      throw new Error("Realm database not initialized");
    }
    return this.realm;
  }

  // User operations
  createUser(email: string, name: string): User {
    const realm = this.ensureRealm();
    let user: User;

    realm.write(() => {
      user = realm.create<User>("User", {
        _id: new Realm.BSON.ObjectId(),
        email,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return user!;
  }

  getUserByEmail(email: string): User | null {
    const realm = this.ensureRealm();
    return realm.objectForPrimaryKey<User>("User", email) || null;
  }

  // Account operations
  createAccount(
    userId: string,
    name: string,
    type: string,
    initialBalance: number = 0,
    currency: string = "USD"
  ): Account {
    const realm = this.ensureRealm();
    let account: Account;

    realm.write(() => {
      account = realm.create<Account>("Account", {
        _id: new Realm.BSON.ObjectId(),
        userId,
        name,
        type,
        balance: initialBalance,
        currency,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return account!;
  }

  getUserAccounts(userId: string): Realm.Results<Account> {
    const realm = this.ensureRealm();
    return realm
      .objects<Account>("Account")
      .filtered("userId == $0 AND isActive == true", userId);
  }

  updateAccountBalance(accountId: string, newBalance: number): void {
    const realm = this.ensureRealm();
    const account = realm.objectForPrimaryKey<Account>(
      "Account",
      new Realm.BSON.ObjectId(accountId)
    );

    if (account) {
      realm.write(() => {
        account.balance = newBalance;
        account.updatedAt = new Date();
      });
    }
  }

  // Category operations
  createCategory(
    userId: string,
    name: string,
    type: string,
    color: string = "#007AFF",
    icon: string = "circle"
  ): Category {
    const realm = this.ensureRealm();
    let category: Category;

    realm.write(() => {
      category = realm.create<Category>("Category", {
        _id: new Realm.BSON.ObjectId(),
        userId,
        name,
        type,
        color,
        icon,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return category!;
  }

  getUserCategories(userId: string, type?: string): Realm.Results<Category> {
    const realm = this.ensureRealm();
    if (type) {
      return realm
        .objects<Category>("Category")
        .filtered(
          "userId == $0 AND type == $1 AND isActive == true",
          userId,
          type
        );
    }
    return realm
      .objects<Category>("Category")
      .filtered("userId == $0 AND isActive == true", userId);
  }

  // Transaction operations
  createTransaction(
    userId: string,
    accountId: string,
    categoryId: string,
    amount: number,
    type: string,
    description: string = "",
    date: Date = new Date()
  ): Transaction {
    const realm = this.ensureRealm();
    let transaction: Transaction;

    realm.write(() => {
      transaction = realm.create<Transaction>("Transaction", {
        _id: new Realm.BSON.ObjectId(),
        userId,
        accountId,
        categoryId,
        amount,
        type,
        description,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update account balance
      const account = realm.objectForPrimaryKey<Account>(
        "Account",
        new Realm.BSON.ObjectId(accountId)
      );
      if (account) {
        if (type === "income") {
          account.balance += amount;
        } else if (type === "expense") {
          account.balance -= amount;
        }
        account.updatedAt = new Date();
      }
    });

    return transaction!;
  }

  getUserTransactions(
    userId: string,
    limit?: number
  ): Realm.Results<Transaction> | Transaction[] {
    const realm = this.ensureRealm();
    const transactions = realm
      .objects<Transaction>("Transaction")
      .filtered("userId == $0", userId)
      .sorted("date", true);

    return limit ? transactions.slice(0, limit) : transactions;
  }

  getAccountTransactions(
    accountId: string,
    limit?: number
  ): Realm.Results<Transaction> | Transaction[] {
    const realm = this.ensureRealm();
    const transactions = realm
      .objects<Transaction>("Transaction")
      .filtered("accountId == $0", accountId)
      .sorted("date", true);

    return limit ? transactions.slice(0, limit) : transactions;
  }

  // Budget operations
  createBudget(
    userId: string,
    categoryId: string,
    amount: number,
    period: string,
    startDate: Date,
    endDate: Date
  ): Budget {
    const realm = this.ensureRealm();
    let budget: Budget;

    realm.write(() => {
      budget = realm.create<Budget>("Budget", {
        _id: new Realm.BSON.ObjectId(),
        userId,
        categoryId,
        amount,
        spent: 0,
        period,
        startDate,
        endDate,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return budget!;
  }

  getUserBudgets(userId: string): Realm.Results<Budget> {
    const realm = this.ensureRealm();
    return realm
      .objects<Budget>("Budget")
      .filtered("userId == $0 AND isActive == true", userId);
  }

  // Utility methods
  getTotalBalance(userId: string): number {
    const accounts = this.getUserAccounts(userId);
    return accounts.sum("balance") as number;
  }

  getMonthlyExpenses(userId: string, month: number, year: number): number {
    const realm = this.ensureRealm();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = realm
      .objects<Transaction>("Transaction")
      .filtered(
        'userId == $0 AND type == "expense" AND date >= $1 AND date <= $2',
        userId,
        startDate,
        endDate
      );

    return expenses.sum("amount") as number;
  }

  getMonthlyIncome(userId: string, month: number, year: number): number {
    const realm = this.ensureRealm();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const income = realm
      .objects<Transaction>("Transaction")
      .filtered(
        'userId == $0 AND type == "income" AND date >= $1 AND date <= $2',
        userId,
        startDate,
        endDate
      );

    return income.sum("amount") as number;
  }
}

export const databaseService = new DatabaseService();
