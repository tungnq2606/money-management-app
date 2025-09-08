import { Budget } from "../schemas/Budget";
import { BaseService } from "./BaseService";

export interface CreateBudgetData {
  name: string;
  walletId: string[];
  categoryId: string;
  amount: number;
  remain?: number;
  loop?: boolean;
  toDate: Date;
  fromDate: Date;
  note?: string;
}

export interface UpdateBudgetData {
  name?: string;
  walletId?: string[];
  categoryId?: string;
  amount?: number;
  remain?: number;
  loop?: boolean;
  toDate?: Date;
  fromDate?: Date;
  note?: string;
}

export class BudgetService extends BaseService {
  protected schemaName = "Budget";

  async createBudget(budgetData: CreateBudgetData): Promise<Budget> {
    return this.create<Budget>({
      ...budgetData,
      remain: budgetData.remain ?? budgetData.amount,
      loop: budgetData.loop ?? false,
      note: budgetData.note ?? "",
    });
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return this.findById<Budget>(id);
  }

  async getAllBudgets(): Promise<Budget[]> {
    return this.findAll<Budget>();
  }

  async getBudgetsByCategory(categoryId: string): Promise<Budget[]> {
    return this.findByFilter<Budget>(`categoryId == "${categoryId}"`);
  }

  async getBudgetsByWallet(walletId: string): Promise<Budget[]> {
    return this.findByFilter<Budget>(`walletId CONTAINS "${walletId}"`);
  }

  async getActiveBudgets(currentDate: Date = new Date()): Promise<Budget[]> {
    return this.findByFilter<Budget>(`fromDate <= $0 AND toDate >= $0`);
  }

  async getRecurringBudgets(): Promise<Budget[]> {
    return this.findByFilter<Budget>(`loop == true`);
  }

  async getBudgetsExceedingLimit(): Promise<Budget[]> {
    return this.findByFilter<Budget>(`remain < 0`);
  }

  async updateBudget(
    id: string,
    updates: UpdateBudgetData
  ): Promise<Budget | null> {
    return this.update<Budget>(id, updates);
  }

  async updateBudgetRemaining(
    id: string,
    newRemaining: number
  ): Promise<Budget | null> {
    return this.update<Budget>(id, { remain: newRemaining });
  }

  async deleteBudget(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async searchBudgetsByName(name: string): Promise<Budget[]> {
    return this.findByFilter<Budget>(`name CONTAINS[c] "${name}"`);
  }

  async getBudgetsInDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Budget[]> {
    return this.findByFilter<Budget>(
      `(fromDate >= $0 AND fromDate <= $1) OR (toDate >= $0 AND toDate <= $1) OR (fromDate <= $0 AND toDate >= $1)`
    );
  }

  async getBudgetsByAmountRange(
    minAmount: number,
    maxAmount: number
  ): Promise<Budget[]> {
    return this.findByFilter<Budget>(
      `amount >= ${minAmount} AND amount <= ${maxAmount}`
    );
  }
}
