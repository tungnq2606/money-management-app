import Realm from "realm";
import { Wallet } from "../schemas/Wallet";

export interface CreateWalletData {
  userId: string;
  name: string;
  type: string;
  amount: number;
  toDate?: Date;
  fromDate?: Date;
}

class WalletService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
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
          toDate: walletData.toDate || now,
          fromDate: walletData.fromDate || now,
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
      const wallets = this.realm
        .objects<Wallet>("Wallet")
        .filtered("userId == $0", userId)
        .sorted("createdAt", true);

      return Array.from(wallets);
    } catch (error) {
      console.error("Error getting wallets by user ID:", error);
      throw error;
    }
  }

  getTotalWalletAmount(userId: string): number {
    try {
      const results = this.realm
        .objects<Wallet>("Wallet")
        .filtered("userId == $0", userId);
      const total = results.reduce((sum, wallet) => sum + wallet.amount, 0);
      return total;
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
      const now = new Date();
      if (!wallet) return null;

      this.realm.write(() => {
        if (updateData.name) wallet.name = updateData.name;
        if (updateData.type) wallet.type = updateData.type;
        if (updateData.amount !== undefined) wallet.amount = updateData.amount;
        if (updateData.toDate) wallet.toDate = updateData.toDate || now;
        if (updateData.fromDate) wallet.fromDate = updateData.fromDate || now;
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
      let deleted = false;

      this.realm.write(() => {
        const walletToDelete = this.realm.objectForPrimaryKey<Wallet>(
          "Wallet",
          new Realm.BSON.ObjectId(walletId)
        );

        if (walletToDelete) {
          this.realm.delete(walletToDelete);
          deleted = true;
        }
      });

      return deleted;
    } catch (error) {
      console.error("Error deleting wallet:", error);
      throw error;
    }
  }

  getAllWallets(): Wallet[] {
    try {
      return Array.from(
        this.realm.objects<Wallet>("Wallet").sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting all wallets:", error);
      throw error;
    }
  }

  // Delete all wallets except for a specific user
  deleteAllWalletsExceptUser(userId: string): void {
    try {
      this.realm.write(() => {
        const walletsToDelete = this.realm
          .objects<Wallet>("Wallet")
          .filtered("userId != $0", userId);

        this.realm.delete(walletsToDelete);
      });
      console.log("All wallets except user's deleted");
    } catch (error) {
      console.error("Error deleting wallets except user:", error);
      throw error;
    }
  }
}

export default WalletService;
