import Realm from "realm";

// User Schema
export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  birthday!: Date;
  phoneNumber!: number;
  address!: string;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      birthday: "date",
      phoneNumber: "int",
      address: "string",
      email: "string",
      password: "string",
      createdAt: "date",
      updatedAt: "date",
    },
  };
}
