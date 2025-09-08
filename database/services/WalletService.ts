import { Wallet } from "../schemas/Wallet";
import { BaseService } from "./BaseService";

export interface CreateWalletData {
  userId: string;
  name: string;
  type: string;
  amount: number;
  toDate: Date;
  fromDate: Date;
}

export interface UpdateWalletData {
  userId?: string;
  name?: string;
  type?: string;
  amount?: number;
  toDate?: Date;
  fromDate?: Date;
}

export class WalletService extends BaseService {
  protected schemaName = "Wallet";

  async createWallet(walletData: CreateWalletData): Promise<Wallet> {
    return this.create<Wallet>(walletData);
  }

  async getWalletById(id: string): Promise<Wallet | null> {
    return this.findById<Wallet>(id);
  }

  async getAllWallets(): Promise<Wallet[]> {
    return this.findAll<Wallet>();
  }

  async getWalletsByUser(userId: string): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(`userId == "${userId}"`);
  }

  async getWalletsByType(type: string): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(`type == "${type}"`);
  }

  async getWalletsByUserAndType(
    userId: string,
    type: string
  ): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(
      `userId == "${userId}" AND type == "${type}"`
    );
  }

  async getActiveWallets(
    userId: string,
    currentDate: Date = new Date()
  ): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(
      `userId == "${userId}" AND fromDate <= $0 AND toDate >= $0`
    );
  }

  async updateWallet(
    id: string,
    updates: UpdateWalletData
  ): Promise<Wallet | null> {
    return this.update<Wallet>(id, updates);
  }

  async updateWalletBalance(
    id: string,
    newAmount: number
  ): Promise<Wallet | null> {
    return this.update<Wallet>(id, { amount: newAmount });
  }

  async addToWalletBalance(id: string, amount: number): Promise<Wallet | null> {
    const wallet = await this.getWalletById(id);
    if (!wallet) return null;

    const newAmount = wallet.amount + amount;
    return this.updateWalletBalance(id, newAmount);
  }

  async subtractFromWalletBalance(
    id: string,
    amount: number
  ): Promise<Wallet | null> {
    const wallet = await this.getWalletById(id);
    if (!wallet) return null;

    const newAmount = wallet.amount - amount;
    return this.updateWalletBalance(id, newAmount);
  }

  async deleteWallet(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async searchWalletsByName(name: string, userId?: string): Promise<Wallet[]> {
    const filter = userId
      ? `name CONTAINS[c] "${name}" AND userId == "${userId}"`
      : `name CONTAINS[c] "${name}"`;
    return this.findByFilter<Wallet>(filter);
  }

  async getWalletsInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(
      `userId == "${userId}" AND ((fromDate >= $0 AND fromDate <= $1) OR (toDate >= $0 AND toDate <= $1) OR (fromDate <= $0 AND toDate >= $1))`
    );
  }

  async getWalletsByAmountRange(
    userId: string,
    minAmount: number,
    maxAmount: number
  ): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(
      `userId == "${userId}" AND amount >= ${minAmount} AND amount <= ${maxAmount}`
    );
  }

  async getTotalBalance(userId: string): Promise<number> {
    const wallets = await this.getWalletsByUser(userId);
    return wallets.reduce((total, wallet) => total + wallet.amount, 0);
  }

  async getWalletsWithLowBalance(
    userId: string,
    threshold: number
  ): Promise<Wallet[]> {
    return this.findByFilter<Wallet>(
      `userId == "${userId}" AND amount < ${threshold}`
    );
  }
}
