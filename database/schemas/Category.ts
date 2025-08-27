import Realm from "realm";

// Category Schema
export class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  name!: string;
  type!: string; // 'income' or 'expense'
  color!: string;
  icon!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "Category",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      type: "string",
      color: { type: "string" as const, default: "#007AFF" },
      icon: { type: "string" as const, default: "circle" },
      isActive: { type: "bool" as const, default: true },
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
