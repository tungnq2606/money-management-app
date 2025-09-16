import Realm from "realm";
import { Wallet } from "../schemas/Wallet";
import RealmService from "./RealmService";

export interface CreateWalletData {
  userId: string;
  name: string;
  type: string;
  amount: number;
  toDate: Date;
  fromDate: Date;
}

class WalletService {
  private realm: Realm;

  constructor() {
    this.realm = RealmService.getInstance().getRealm();
  }

  createWallet(walletData: CreateWalletData): Wallet {
    try {
      const now = new Date();
      const wallet = this.realm.write(() => {
        return this.realm.create<Wallet>("Wallet", {
          _id: new Realm.BSON.ObjectId(),
          userId: walletData.userId,
          name: walletData.name,
          type: walletData.type,
          amount: walletData.amount,
          toDate: walletData.toDate,
          fromDate: walletData.fromDate,
          createdAt: now,
          updatedAt: now,
        });
      });

      return wallet;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  getWalletsByUserId(userId: string): Wallet[] {
    try {
      return Array.from(
        this.realm
          .objects<Wallet>("Wallet")
          .filtered("userId == $0", userId)
          .sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting wallets by user ID:", error);
      throw error;
    }
  }

  getWalletById(walletId: string): Wallet | null {
    try {
      const wallet = this.realm
        .objects<Wallet>("Wallet")
        .filtered("_id == $0", new Realm.BSON.ObjectId(walletId))[0];

      return wallet || null;
    } catch (error) {
      console.error("Error getting wallet by ID:", error);
      throw error;
    }
  }

  updateWallet(
    walletId: string,
    updateData: Partial<CreateWalletData>
  ): Wallet | null {
    try {
      const wallet = this.getWalletById(walletId);
      if (!wallet) return null;

      this.realm.write(() => {
        if (updateData.name) wallet.name = updateData.name;
        if (updateData.type) wallet.type = updateData.type;
        if (updateData.amount !== undefined) wallet.amount = updateData.amount;
        if (updateData.toDate) wallet.toDate = updateData.toDate;
        if (updateData.fromDate) wallet.fromDate = updateData.fromDate;
        wallet.updatedAt = new Date();
      });

      return wallet;
    } catch (error) {
      console.error("Error updating wallet:", error);
      throw error;
    }
  }

  updateWalletAmount(walletId: string, amount: number): Wallet | null {
    try {
      const wallet = this.getWalletById(walletId);
      if (!wallet) return null;

      this.realm.write(() => {
        wallet.amount = amount;
        wallet.updatedAt = new Date();
      });

      return wallet;
    } catch (error) {
      console.error("Error updating wallet amount:", error);
      throw error;
    }
  }

  deleteWallet(walletId: string): boolean {
    try {
      const wallet = this.getWalletById(walletId);
      if (!wallet) return false;

      this.realm.write(() => {
        this.realm.delete(wallet);
      });

      return true;
    } catch (error) {
      console.error("Error deleting wallet:", error);
      throw error;
    }
  }
}

export default WalletService;
