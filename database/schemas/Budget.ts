import Realm from "realm";

// Budget Schema
export class Budget extends Realm.Object<Budget> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  walletId!: string[];
  categoryId!: string;
  amount!: number;
  remain!: number;
  loop!: boolean;
  toDate!: Date;
  fromDate!: Date;
  note!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Budget",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      walletId: "string[]",
      categoryId: "string",
      amount: "double",
      remain: { type: "double" as const, default: 0 },
      loop: { type: "bool" as const, default: false },
      toDate: "date",
      fromDate: "date",
      note: { type: "string" as const, default: "" },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
