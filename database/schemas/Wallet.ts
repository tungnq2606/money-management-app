import Realm from "realm";

// Wallet Schema
export class Wallet extends Realm.Object<Wallet> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  name!: string;
  type!: string;
  amount!: number;
  toDate!: Date;
  fromDate!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Wallet",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      type: "string",
      amount: "double",
      toDate: "date",
      fromDate: "date",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
