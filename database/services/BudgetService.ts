import Realm from "realm";
import { Budget } from "../schemas/Budget";
import { Transaction } from "../schemas/Transaction";

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
  userId: string;
}

class BudgetService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  createBudget(budgetData: CreateBudgetData): Budget {
    try {
      const now = new Date();
      const budget = this.realm.write(() => {
        return this.realm.create<Budget>("Budget", {
          _id: new Realm.BSON.ObjectId(),
          name: budgetData.name,
          walletId: budgetData.walletId,
          categoryId: budgetData.categoryId,
          userId: budgetData.userId,
          amount: budgetData.amount,
          remain: budgetData.remain || budgetData.amount,
          loop: budgetData.loop || false,
          toDate: budgetData.toDate,
          fromDate: budgetData.fromDate,
          note: budgetData.note || "",
          createdAt: now,
          updatedAt: now,
        });
      });

      return budget;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  }

  getBudgetsByUserId(userId: string): Budget[] {
    try {
      return Array.from(
        this.realm
          .objects<Budget>("Budget")
          .filtered("userId == $0", userId)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting budgets by user ID:", error);
      throw error;
    }
  }

  getBudgetsByCategoryId(categoryId: string): Budget[] {
    try {
      return Array.from(
        this.realm
          .objects<Budget>("Budget")
          .filtered("categoryId == $0", categoryId)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting budgets by category ID:", error);
      throw error;
    }
  }

  getBudgetsByWalletId(walletId: string): Budget[] {
    try {
      return Array.from(
        this.realm
          .objects<Budget>("Budget")
          .filtered("walletId CONTAINS $0", walletId)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting budgets by wallet ID:", error);
      throw error;
    }
  }

  getActiveBudgets(): Budget[] {
    try {
      const now = new Date();
      return Array.from(
        this.realm
          .objects<Budget>("Budget")
          .filtered("fromDate <= $0 AND toDate >= $0", now)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting active budgets:", error);
      throw error;
    }
  }

  getBudgetById(budgetId: string): Budget | null {
    try {
      const budget = this.realm
        .objects<Budget>("Budget")
        .filtered("_id == $0", new Realm.BSON.ObjectId(budgetId))[0];

      return budget || null;
    } catch (error) {
      console.error("Error getting budget by ID:", error);
      throw error;
    }
  }

  updateBudget(
    budgetId: string,
    updateData: Partial<CreateBudgetData>
  ): Budget | null {
    try {
      const budget = this.getBudgetById(budgetId);
      if (!budget) return null;

      this.realm.write(() => {
        if (updateData.name) budget.name = updateData.name;
        if (updateData.walletId) budget.walletId = updateData.walletId;
        if (updateData.categoryId) budget.categoryId = updateData.categoryId;
        if (updateData.amount !== undefined) budget.amount = updateData.amount;
        if (updateData.remain !== undefined) budget.remain = updateData.remain;
        if (updateData.loop !== undefined) budget.loop = updateData.loop;
        if (updateData.toDate) budget.toDate = updateData.toDate;
        if (updateData.fromDate) budget.fromDate = updateData.fromDate;
        if (updateData.note !== undefined) budget.note = updateData.note;
        budget.updatedAt = new Date();
      });

      return budget;
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  }

  updateBudgetRemain(budgetId: string, remain: number): Budget | null {
    try {
      const budget = this.getBudgetById(budgetId);
      if (!budget) return null;

      this.realm.write(() => {
        budget.remain = remain;
        budget.updatedAt = new Date();
      });

      return budget;
    } catch (error) {
      console.error("Error updating budget remain:", error);
      throw error;
    }
  }

  deleteBudget(budgetId: string): boolean {
    try {
      const budget = this.getBudgetById(budgetId);
      if (!budget) return false;

      this.realm.write(() => {
        this.realm.delete(budget);
      });

      return true;
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  }

  getAllBudgets(): Budget[] {
    try {
      return Array.from(
        this.realm.objects<Budget>("Budget").sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting all budgets:", error);
      throw error;
    }
  }

  // Get budgets for a user and compute spent from transactions, updating remain
  getBudgetsByUserIdWithSpending(userId: string): {
    budget: Budget;
    spent: number;
    remain: number;
  }[] {
    try {
      const budgets = this.getBudgetsByUserId(userId);

      return budgets.map((budget) => {
        // Build dynamic query for wallet IN {...}
        let query =
          "type == 'expense' AND categoryId == $0 AND createdAt >= $1 AND createdAt <= $2";
        const params: any[] = [
          budget.categoryId,
          budget.fromDate,
          budget.toDate,
        ];

        if (budget.walletId && budget.walletId.length > 0) {
          const placeholders = budget.walletId
            .map((_, idx) => `$${params.length + idx}`)
            .join(", ");
          query += ` AND walletId IN {${placeholders}}`;
          params.push(...budget.walletId);
        }

        const transactions = this.realm
          .objects<Transaction>("Transaction")
          .filtered(query, ...params);

        const spent = Array.from(transactions).reduce(
          (sum, t) => sum + t.amount,
          0
        );
        const calculatedRemain = Math.max(0, budget.amount - spent);

        // Persist the updated remain for consistency
        this.realm.write(() => {
          budget.remain = calculatedRemain;
          budget.updatedAt = new Date();
        });

        return { budget, spent, remain: calculatedRemain };
      });
    } catch (error) {
      console.error("Error getting budgets by user ID with spending:", error);
      throw error;
    }
  }

  // Get budgets with spending computed within a custom date range
  getBudgetsByUserIdWithSpendingInRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): {
    budget: Budget;
    spent: number;
    remain: number;
  }[] {
    try {
      const budgets = this.getBudgetsByUserId(userId);

      return budgets
        .map((budget) => {
          // Determine overlap between requested range and budget's own range
          const effectiveStart = new Date(
            Math.max(startDate.getTime(), budget.fromDate.getTime())
          );
          const effectiveEnd = new Date(
            Math.min(endDate.getTime(), budget.toDate.getTime())
          );

          // Skip if there is no overlap
          if (effectiveStart.getTime() > effectiveEnd.getTime()) {
            return null;
          }

          let query =
            "type == 'expense' AND categoryId == $0 AND createdAt >= $1 AND createdAt <= $2";
          const params: any[] = [
            budget.categoryId,
            effectiveStart,
            effectiveEnd,
          ];

          if (budget.walletId && budget.walletId.length > 0) {
            const placeholders = budget.walletId
              .map((_, idx) => `$${params.length + idx}`)
              .join(", ");
            query += ` AND walletId IN {${placeholders}}`;
            params.push(...budget.walletId);
          }

          const transactions = this.realm
            .objects<Transaction>("Transaction")
            .filtered(query, ...params);

          const spent = Array.from(transactions).reduce(
            (sum, t) => sum + t.amount,
            0
          );

          const calculatedRemain = Math.max(0, budget.amount - spent);

          // Do not overwrite budget period-based remain here; keep this method pure
          return { budget, spent, remain: calculatedRemain };
        })
        .filter((x): x is { budget: Budget; spent: number; remain: number } =>
          Boolean(x)
        );
    } catch (error) {
      console.error(
        "Error getting budgets by user ID with spending in range:",
        error
      );
      throw error;
    }
  }
}

export default BudgetService;
