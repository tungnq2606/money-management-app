import * as Crypto from "expo-crypto";
import Realm from "realm";
import { User } from "../schemas/User";
import RealmService from "./RealmService";

export interface CreateUserData {
  name: string;
  birthday: Date;
  phoneNumber: number;
  address: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class UserService {
  private realm: Realm;

  constructor() {
    this.realm = RealmService.getInstance().getRealm();
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Hash password before storing
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        userData.password
      );

      const now = new Date();
      const user = this.realm.write(() => {
        return this.realm.create<User>("User", {
          _id: new Realm.BSON.ObjectId(),
          name: userData.name,
          birthday: userData.birthday,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        });
      });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async signIn(signInData: SignInData): Promise<User | null> {
    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        signInData.password
      );

      const user = this.realm
        .objects<User>("User")
        .filtered(
          "email == $0 AND password == $1",
          signInData.email.toLowerCase(),
          hashedPassword
        )[0];

      return user || null;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  getUserByEmail(email: string): User | null {
    try {
      const user = this.realm
        .objects<User>("User")
        .filtered("email == $0", email.toLowerCase())[0];

      return user || null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  getUserById(id: string): User | null {
    try {
      const user = this.realm
        .objects<User>("User")
        .filtered("_id == $0", new Realm.BSON.ObjectId(id))[0];

      return user || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  updateUser(userId: string, updateData: Partial<CreateUserData>): User | null {
    try {
      const user = this.getUserById(userId);
      if (!user) return null;

      this.realm.write(() => {
        if (updateData.name) user.name = updateData.name;
        if (updateData.birthday) user.birthday = updateData.birthday;
        if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;
        if (updateData.address) user.address = updateData.address;
        if (updateData.email) user.email = updateData.email.toLowerCase();
        user.updatedAt = new Date();
      });

      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  deleteUser(userId: string): boolean {
    try {
      const user = this.getUserById(userId);
      if (!user) return false;

      this.realm.write(() => {
        this.realm.delete(user);
      });

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  getAllUsers(): User[] {
    try {
      return Array.from(
        this.realm.objects<User>("User").sorted("createdAt", true)
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }
}

export default UserService;
