import Realm from "realm";
import { Transaction } from "../schemas/Transaction";

export interface CreateTransactionData {
  walletId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  note?: string;
}

class TransactionService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  createTransaction(transactionData: CreateTransactionData): Transaction {
    try {
      const now = new Date();
      const transaction = this.realm.write(() => {
        return this.realm.create<Transaction>("Transaction", {
          _id: new Realm.BSON.ObjectId(),
          walletId: transactionData.walletId,
          categoryId: transactionData.categoryId,
          amount: transactionData.amount,
          type: transactionData.type,
          note: transactionData.note || "",
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
          .sorted("createdAt", true)
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
          .sorted("createdAt", true)
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
          .sorted("createdAt", true)
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
          .filtered("createdAt >= $0 AND createdAt <= $1", startDate, endDate)
          .sorted("createdAt", true)
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
        query += ` AND createdAt >= $${queryParams.length}`;
        queryParams.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ` AND createdAt <= $${queryParams.length}`;
        queryParams.push(filters.endDate);
      }

      const results = this.realm
        .objects<Transaction>("Transaction")
        .filtered(query, ...queryParams)
        .sorted("createdAt", true);

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
        this.realm.objects<Transaction>("Transaction").sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting all transactions:", error);
      throw error;
    }
  }
}

export default TransactionService;
