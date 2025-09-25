import Realm from "realm";

// Transaction Schema
export class Transaction extends Realm.Object<Transaction> {
  _id!: Realm.BSON.ObjectId;
  walletId!: string;
  categoryId!: string;
  amount!: number;
  type!: "income" | "expense";
  note!: string;
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Transaction",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      walletId: "string",
      categoryId: "string",
      amount: "double",
      type: "string",
      note: { type: "string" as const, default: "" },
      date: "date",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
