import Realm from "realm";

// User Schema
export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  email!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      email: "string",
      name: "string",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
