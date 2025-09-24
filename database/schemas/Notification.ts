import Realm from "realm";

// Notification Schema
export class Notification extends Realm.Object<Notification> {
  _id!: Realm.BSON.ObjectId;
  content!: string;
  link!: string;
  time!: Date;
  isRead!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: string;

  static schema = {
    name: "Notification",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      content: "string",
      link: { type: "string" as const, default: "" },
      time: "date",
      isRead: { type: "bool" as const, default: false },
      createdAt: "date",
      updatedAt: "date",
      userId: "string",
    },
  };
}
