import Realm from "realm";

// Account Schema (for different bank accounts, wallets, etc.)
export class Account extends Realm.Object<Account> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  name!: string;
  type!: string; // 'checking', 'savings', 'credit', 'cash', 'investment'
  balance!: number;
  currency!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Account",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      type: "string",
      balance: "double",
      currency: { type: "string" as const, default: "USD" },
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
