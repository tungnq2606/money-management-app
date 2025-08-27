import Realm from "realm";

// Budget Schema
export class Budget extends Realm.Object<Budget> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  categoryId!: string;
  amount!: number;
  spent!: number;
  period!: string; // 'monthly', 'weekly', 'yearly'
  startDate!: Date;
  endDate!: Date;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Budget",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      categoryId: "string",
      amount: "double",
      spent: { type: "double" as const, default: 0 },
      period: "string",
      startDate: "date",
      endDate: "date",
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
