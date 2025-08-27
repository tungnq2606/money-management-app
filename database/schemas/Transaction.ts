import Realm from "realm";

// Transaction Schema
export class Transaction extends Realm.Object<Transaction> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  accountId!: string;
  categoryId!: string;
  amount!: number;
  type!: string; // 'income', 'expense', 'transfer'
  description!: string;
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      accountId: "string",
      categoryId: "string",
      amount: "double",
      type: "string",
      description: { type: "string" as const, default: "" },
      date: "date",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
