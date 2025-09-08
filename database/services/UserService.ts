import { User } from "../schemas/User";
import { BaseService } from "./BaseService";

export interface CreateUserData {
  name: string;
  birthday: Date;
  phoneNumber: number;
  address: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  birthday?: Date;
  phoneNumber?: number;
  address?: string;
  email?: string;
  password?: string;
}

export class UserService extends BaseService {
  protected schemaName = "User";

  async createUser(userData: CreateUserData): Promise<User> {
    return this.create<User>(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.findById<User>(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.findAll<User>();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.findByFilter<User>(`email == "${email}"`);
    return users.length > 0 ? users[0] : null;
  }

  async getUserByPhoneNumber(phoneNumber: number): Promise<User | null> {
    const users = await this.findByFilter<User>(
      `phoneNumber == ${phoneNumber}`
    );
    return users.length > 0 ? users[0] : null;
  }

  async updateUser(id: string, updates: UpdateUserData): Promise<User | null> {
    return this.update<User>(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const users = await this.findByFilter<User>(
      `email == "${email}" AND password == "${password}"`
    );
    return users.length > 0 ? users[0] : null;
  }

  async searchUsersByName(name: string): Promise<User[]> {
    return this.findByFilter<User>(`name CONTAINS[c] "${name}"`);
  }

  async getUsersCreatedBetween(
    startDate: Date,
    endDate: Date
  ): Promise<User[]> {
    return this.findByFilter<User>(`createdAt >= $0 AND createdAt <= $1`);
  }
}
