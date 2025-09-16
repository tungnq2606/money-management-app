import Realm from "realm";
import { realmConfig } from "../schemas";

class RealmService {
  private static instance: RealmService;
  private realm: Realm | null = null;

  private constructor() {}

  public static getInstance(): RealmService {
    if (!RealmService.instance) {
      RealmService.instance = new RealmService();
    }
    return RealmService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.realm = await Realm.open(realmConfig);
      console.log("📁 Database file location:", this.realm.path);
    } catch (error) {
      console.error("Failed to initialize Realm:", error);
      throw error;
    }
  }

  public getRealm(): Realm {
    if (!this.realm) {
      throw new Error("Realm not initialized. Call initialize() first.");
    }
    return this.realm;
  }

  public close(): void {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}

export default RealmService;
