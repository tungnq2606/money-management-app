import Realm from "realm";
import { Category } from "../schemas/Category";
import { Transaction } from "../schemas/Transaction";
import { Wallet } from "../schemas/Wallet";

export interface CreateTransactionData {
  walletId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  note?: string;
  date?: Date;
}

class TransactionService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  createTransaction(transactionData: CreateTransactionData): Transaction {
    try {
      const now = new Date();
      const transactionDate = transactionData.date || now;
      const transaction = this.realm.write(() => {
        return this.realm.create<Transaction>("Transaction", {
          _id: new Realm.BSON.ObjectId(),
          walletId: transactionData.walletId,
          categoryId: transactionData.categoryId,
          amount: transactionData.amount,
          type: transactionData.type,
          note: transactionData.note || "",
          date: transactionDate,
          createdAt: now,
          updatedAt: now,
        });
      });

      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  getTransactionsByWalletId(walletId: string): Transaction[] {
    try {
      return Array.from(
        this.realm
          .objects<Transaction>("Transaction")
          .filtered("walletId == $0", walletId)
          .sorted("date", true)
      );
    } catch (error) {
      console.error("Error getting transactions by wallet ID:", error);
      throw error;
    }
  }

  getTransactionsByCategoryId(categoryId: string): Transaction[] {
    try {
      return Array.from(
        this.realm
          .objects<Transaction>("Transaction")
          .filtered("categoryId == $0", categoryId)
          .sorted("date", true)
      );
    } catch (error) {
      console.error("Error getting transactions by category ID:", error);
      throw error;
    }
  }

  getTransactionsByType(type: "income" | "expense"): Transaction[] {
    try {
      return Array.from(
        this.realm
          .objects<Transaction>("Transaction")
          .filtered("type == $0", type)
          .sorted("date", true)
      );
    } catch (error) {
      console.error("Error getting transactions by type:", error);
      throw error;
    }
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[] {
    try {
      return Array.from(
        this.realm
          .objects<Transaction>("Transaction")
          .filtered("date >= $0 AND date <= $1", startDate, endDate)
          .sorted("date", true)
      );
    } catch (error) {
      console.error("Error getting transactions by date range:", error);
      throw error;
    }
  }

  getTransactionById(transactionId: string): Transaction | null {
    try {
      const transaction = this.realm
        .objects<Transaction>("Transaction")
        .filtered("_id == $0", new Realm.BSON.ObjectId(transactionId))[0];

      return transaction || null;
    } catch (error) {
      console.error("Error getting transaction by ID:", error);
      throw error;
    }
  }

  updateTransaction(
    transactionId: string,
    updateData: Partial<CreateTransactionData>
  ): Transaction | null {
    try {
      const transaction = this.getTransactionById(transactionId);
      if (!transaction) return null;

      this.realm.write(() => {
        if (updateData.walletId) transaction.walletId = updateData.walletId;
        if (updateData.categoryId)
          transaction.categoryId = updateData.categoryId;
        if (updateData.amount !== undefined)
          transaction.amount = updateData.amount;
        if (updateData.type) transaction.type = updateData.type;
        if (updateData.note !== undefined) transaction.note = updateData.note;
        if (updateData.date) transaction.date = updateData.date;
        transaction.updatedAt = new Date();
      });

      return transaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  deleteTransaction(transactionId: string): boolean {
    try {
      const transaction = this.getTransactionById(transactionId);
      if (!transaction) return false;

      this.realm.write(() => {
        this.realm.delete(transaction);
      });

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  // Get transactions with filters
  getTransactionsWithFilters(filters: {
    walletIds?: string[];
    categoryIds?: string[];
    type?: "income" | "expense";
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Transaction[] {
    try {
      let query = "TRUEPREDICATE";
      const queryParams: any[] = [];

      if (filters.walletIds && filters.walletIds.length > 0) {
        query += ` AND walletId IN {${filters.walletIds
          .map((_, index) => `$${queryParams.length + index}`)
          .join(", ")}}`;
        queryParams.push(...filters.walletIds);
      }

      if (filters.categoryIds && filters.categoryIds.length > 0) {
        query += ` AND categoryId IN {${filters.categoryIds
          .map((_, index) => `$${queryParams.length + index}`)
          .join(", ")}}`;
        queryParams.push(...filters.categoryIds);
      }

      if (filters.type) {
        query += ` AND type == $${queryParams.length}`;
        queryParams.push(filters.type);
      }

      if (filters.startDate) {
        query += ` AND date >= $${queryParams.length}`;
        queryParams.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ` AND date <= $${queryParams.length}`;
        queryParams.push(filters.endDate);
      }

      const results = this.realm
        .objects<Transaction>("Transaction")
        .filtered(query, ...queryParams)
        .sorted("date", true);

      const transactionArray = Array.from(results);

      if (filters.limit) {
        return transactionArray.slice(0, filters.limit);
      }

      return transactionArray;
    } catch (error) {
      console.error("Error getting transactions with filters:", error);
      throw error;
    }
  }

  getAllTransactions(): Transaction[] {
    try {
      return Array.from(
        this.realm.objects<Transaction>("Transaction").sorted("date", true)
      );
    } catch (error) {
      console.error("Error getting all transactions:", error);
      throw error;
    }
  }

  // Helper method to create 100 sample transactions for testing
  createSampleTransactions(walletId: string): void {
    try {
      // Get all categories from the database
      const allCategories = this.realm.objects<Category>("Category");
      const incomeCategories = Array.from(
        allCategories.filtered("type == 'income'")
      );
      const expenseCategories = Array.from(
        allCategories.filtered("type == 'expense'")
      );

      if (incomeCategories.length === 0 || expenseCategories.length === 0) {
        console.error(
          "No categories found. Please create default categories first."
        );
        return;
      }

      // Sample transaction data with amounts and notes
      const sampleIncomes = [
        {
          amounts: [3500, 4000, 4500, 5000],
          notes: ["Monthly salary", "Salary payment", "Payroll"],
        },
        {
          amounts: [500, 800, 1200, 1500],
          notes: ["Freelance project", "Consulting fee", "Side business"],
        },
        {
          amounts: [200, 350, 600, 1000],
          notes: ["Stock dividend", "Crypto gains", "Bond interest"],
        },
        {
          amounts: [50, 100, 200, 300],
          notes: ["Gift money", "Refund", "Cashback"],
        },
      ];

      const sampleExpenses = [
        {
          amounts: [15, 25, 45, 80],
          notes: ["Lunch", "Dinner", "Groceries", "Restaurant"],
        },
        {
          amounts: [5, 15, 35, 60],
          notes: ["Bus fare", "Gas", "Uber ride", "Parking"],
        },
        {
          amounts: [30, 75, 150, 300],
          notes: ["Clothes", "Electronics", "Home items", "Books"],
        },
        {
          amounts: [12, 20, 40, 85],
          notes: ["Movie ticket", "Concert", "Games", "Streaming"],
        },
        {
          amounts: [50, 100, 200, 400],
          notes: ["Internet", "Electricity", "Phone", "Rent"],
        },
        {
          amounts: [25, 50, 100, 200],
          notes: ["Pharmacy", "Doctor visit", "Insurance", "Dental"],
        },
        {
          amounts: [20, 50, 100, 500],
          notes: ["Books", "Course", "Workshop", "Tuition"],
        },
        {
          amounts: [10, 25, 50, 100],
          notes: ["Miscellaneous", "Fees", "Donations", "Gifts"],
        },
      ];

      const now = new Date();
      let transactionCount = 0;

      // Generate transactions for the last 3 months
      for (let month = 0; month < 3 && transactionCount < 100; month++) {
        for (let day = 1; day <= 30 && transactionCount < 100; day++) {
          const transactionDate = new Date(
            now.getFullYear(),
            now.getMonth() - month,
            day
          );

          // Skip future dates
          if (transactionDate > now) continue;

          // Generate 1-3 transactions per day randomly
          const dailyTransactions = Math.floor(Math.random() * 3) + 1;

          for (
            let i = 0;
            i < dailyTransactions && transactionCount < 100;
            i++
          ) {
            const isIncome = Math.random() < 0.3; // 30% chance of income

            if (isIncome) {
              const incomeData =
                sampleIncomes[Math.floor(Math.random() * sampleIncomes.length)];
              const amount =
                incomeData.amounts[
                  Math.floor(Math.random() * incomeData.amounts.length)
                ];
              const note =
                incomeData.notes[
                  Math.floor(Math.random() * incomeData.notes.length)
                ];

              // Get a random income category
              const randomIncomeCategory =
                incomeCategories[
                  Math.floor(Math.random() * incomeCategories.length)
                ];

              this.createTransaction({
                walletId,
                categoryId: randomIncomeCategory._id.toString(),
                amount,
                type: "income",
                note,
                date: new Date(
                  transactionDate.getTime() +
                    Math.random() * 24 * 60 * 60 * 1000
                ), // Random time of day
              });
            } else {
              const expenseData =
                sampleExpenses[
                  Math.floor(Math.random() * sampleExpenses.length)
                ];
              const amount =
                expenseData.amounts[
                  Math.floor(Math.random() * expenseData.amounts.length)
                ];
              const note =
                expenseData.notes[
                  Math.floor(Math.random() * expenseData.notes.length)
                ];

              // Get a random expense category
              const randomExpenseCategory =
                expenseCategories[
                  Math.floor(Math.random() * expenseCategories.length)
                ];

              this.createTransaction({
                walletId,
                categoryId: randomExpenseCategory._id.toString(),
                amount,
                type: "expense",
                note,
                date: new Date(
                  transactionDate.getTime() +
                    Math.random() * 24 * 60 * 60 * 1000
                ), // Random time of day
              });
            }

            transactionCount++;
          }
        }
      }

      console.log(`Created ${transactionCount} sample transactions`);
    } catch (error) {
      console.error("Error creating sample transactions:", error);
      throw error;
    }
  }

  // Helper method to delete all transactions (useful for testing)
  deleteAllTransactions(): void {
    try {
      this.realm.write(() => {
        const allTransactions = this.realm.objects<Transaction>("Transaction");
        this.realm.delete(allTransactions);
      });
      console.log("All transactions deleted");
    } catch (error) {
      console.error("Error deleting all transactions:", error);
      throw error;
    }
  }

  // Delete all transactions except for a specific user
  deleteAllTransactionsExceptUser(userId: string): void {
    try {
      this.realm.write(() => {
        // Get all wallets for the user
        const userWallets = this.realm
          .objects<Wallet>("Wallet")
          .filtered("userId == $0", userId);

        const userWalletIds = Array.from(userWallets).map((wallet) =>
          wallet._id.toString()
        );

        // Delete all transactions that don't belong to user's wallets
        const transactionsToDelete = this.realm
          .objects<Transaction>("Transaction")
          .filtered("NOT walletId IN $0", userWalletIds);

        this.realm.delete(transactionsToDelete);
      });
      console.log("All transactions except user's deleted");
    } catch (error) {
      console.error("Error deleting transactions except user:", error);
      throw error;
    }
  }
}

export default TransactionService;
