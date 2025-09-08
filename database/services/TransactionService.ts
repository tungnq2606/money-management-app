import { Transaction } from "../schemas/Transaction";
import { BaseService } from "./BaseService";

export interface CreateTransactionData {
  walletId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  note?: string;
}

export interface UpdateTransactionData {
  walletId?: string;
  categoryId?: string;
  amount?: number;
  type?: "income" | "expense";
  note?: string;
}

export class TransactionService extends BaseService {
  protected schemaName = "Transaction";

  async createTransaction(
    transactionData: CreateTransactionData
  ): Promise<Transaction> {
    return this.create<Transaction>({
      ...transactionData,
      note: transactionData.note ?? "",
    });
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.findById<Transaction>(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.findAll<Transaction>();
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(`walletId == "${walletId}"`);
  }

  async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(`categoryId == "${categoryId}"`);
  }

  async getTransactionsByType(
    type: "income" | "expense"
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(`type == "${type}"`);
  }

  async getTransactionsByWalletAndType(
    walletId: string,
    type: "income" | "expense"
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(
      `walletId == "${walletId}" AND type == "${type}"`
    );
  }

  async getTransactionsInDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(
      `createdAt >= $0 AND createdAt <= $1`
    );
  }

  async getTransactionsByWalletInDateRange(
    walletId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(
      `walletId == "${walletId}" AND createdAt >= $0 AND createdAt <= $1`
    );
  }

  async getTransactionsByAmountRange(
    minAmount: number,
    maxAmount: number
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(
      `amount >= ${minAmount} AND amount <= ${maxAmount}`
    );
  }

  async updateTransaction(
    id: string,
    updates: UpdateTransactionData
  ): Promise<Transaction | null> {
    return this.update<Transaction>(id, updates);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async searchTransactionsByNote(searchText: string): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(`note CONTAINS[c] "${searchText}"`);
  }

  async getIncomeTransactions(): Promise<Transaction[]> {
    return this.getTransactionsByType("income");
  }

  async getExpenseTransactions(): Promise<Transaction[]> {
    return this.getTransactionsByType("expense");
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const allTransactions = await this.findAll<Transaction>();
    return allTransactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getTransactionsByWalletAndDateRange(
    walletId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.findByFilter<Transaction>(
      `walletId == "${walletId}" AND createdAt >= $0 AND createdAt <= $1`
    );
  }

  async getTotalAmountByType(
    type: "income" | "expense",
    walletId?: string
  ): Promise<number> {
    const filter = walletId
      ? `type == "${type}" AND walletId == "${walletId}"`
      : `type == "${type}"`;

    const transactions = await this.findByFilter<Transaction>(filter);
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  }

  async getTotalIncomeByWallet(walletId: string): Promise<number> {
    return this.getTotalAmountByType("income", walletId);
  }

  async getTotalExpenseByWallet(walletId: string): Promise<number> {
    return this.getTotalAmountByType("expense", walletId);
  }

  async getNetAmountByWallet(walletId: string): Promise<number> {
    const income = await this.getTotalIncomeByWallet(walletId);
    const expense = await this.getTotalExpenseByWallet(walletId);
    return income - expense;
  }

  async getTransactionsByMultipleWallets(
    walletIds: string[]
  ): Promise<Transaction[]> {
    const walletFilter = walletIds.map((id) => `"${id}"`).join(",");
    return this.findByFilter<Transaction>(`walletId IN {${walletFilter}}`);
  }
}
