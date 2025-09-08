import "react-native-get-random-values"; // Must be first import for BSON crypto polyfill
import Realm from "realm";
import { realmConfig } from "../schemas";

export abstract class BaseService {
  protected realm: Realm | null = null;
  protected abstract schemaName: string;

  protected async getRealm(): Promise<Realm> {
    if (!this.realm) {
      this.realm = await Realm.open(realmConfig);
    }
    return this.realm;
  }

  async create<T>(data: any): Promise<T> {
    const realm = await this.getRealm();
    let result: T;

    realm.write(() => {
      const now = new Date();
      result = realm.create<T>(this.schemaName, {
        _id: new Realm.BSON.ObjectId(),
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    });

    return result!;
  }

  async findById<T>(id: string | Realm.BSON.ObjectId): Promise<T | null> {
    const realm = await this.getRealm();
    const objectId = typeof id === "string" ? new Realm.BSON.ObjectId(id) : id;
    return (realm.objectForPrimaryKey as any)(
      this.schemaName,
      objectId
    ) as T | null;
  }

  async findAll<T>(): Promise<T[]> {
    const realm = await this.getRealm();
    const results = realm.objects(this.schemaName);
    return Array.from(results) as T[];
  }

  async findByFilter<T>(filter: string): Promise<T[]> {
    const realm = await this.getRealm();
    const results = realm.objects(this.schemaName).filtered(filter);
    return Array.from(results) as T[];
  }

  async update<T>(
    id: string | Realm.BSON.ObjectId,
    updates: any
  ): Promise<T | null> {
    const realm = await this.getRealm();
    const objectId = typeof id === "string" ? new Realm.BSON.ObjectId(id) : id;
    const object = (realm.objectForPrimaryKey as any)(
      this.schemaName,
      objectId
    ) as T | null;

    if (!object) {
      return null;
    }

    realm.write(() => {
      Object.assign(object, {
        ...updates,
        updatedAt: new Date(),
      });
    });

    return object;
  }

  async delete(id: string | Realm.BSON.ObjectId): Promise<boolean> {
    const realm = await this.getRealm();
    const objectId = typeof id === "string" ? new Realm.BSON.ObjectId(id) : id;
    const object = (realm.objectForPrimaryKey as any)(
      this.schemaName,
      objectId
    );

    if (!object) {
      return false;
    }

    realm.write(() => {
      realm.delete(object);
    });

    return true;
  }

  async deleteAll(): Promise<void> {
    const realm = await this.getRealm();
    const objects = realm.objects(this.schemaName);

    realm.write(() => {
      realm.delete(objects);
    });
  }

  async count(): Promise<number> {
    const realm = await this.getRealm();
    return realm.objects(this.schemaName).length;
  }

  closeRealm(): void {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}
