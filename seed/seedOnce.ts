import AsyncStorage from "@react-native-async-storage/async-storage";
import Realm from "realm";
import {
  Budget,
  Category,
  Notification,
  Transaction,
  User,
  Wallet,
} from "../database/schemas";

const SEED_FLAG = "realm_seed_v1";

const now = () => new Date();
const daysFromNow = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t;
};

export async function seedRealmIfNeeded(realm: Realm) {
  const done = await AsyncStorage.getItem(SEED_FLAG);
  if (done) return;

  // Tạo trước các ObjectId để liên kết
  const user1Id = new Realm.BSON.ObjectId();
  const walletCashId = new Realm.BSON.ObjectId();
  const walletBankId = new Realm.BSON.ObjectId();

  const catFoodId = new Realm.BSON.ObjectId();
  const catTransportId = new Realm.BSON.ObjectId();
  const catSalaryId = new Realm.BSON.ObjectId();

  const notif1Id = new Realm.BSON.ObjectId();

  // map chuỗi hex cho các field string (FK)
  const user1Hex = user1Id.toHexString();
  const walletCashHex = walletCashId.toHexString();
  const walletBankHex = walletBankId.toHexString();

  const catFoodHex = catFoodId.toHexString();
  const catTransportHex = catTransportId.toHexString();
  const catSalaryHex = catSalaryId.toHexString();

  realm.write(() => {
    // 1) Users
    realm.create<User>(
      "User",
      {
        _id: user1Id,
        name: "Nguyễn Văn A",
        birthday: new Date("1995-06-15"),
        phoneNumber: 849123456, // int (đừng để quá lớn)
        address: "Hà Nội",
        email: "a.nguyen@example.com",
        password: "12345678",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    // 2) Wallets (liên User)
    realm.create<Wallet>(
      "Wallet",
      {
        _id: walletCashId,
        userId: user1Hex,
        name: "Ví Tiền Mặt",
        type: "cash",
        amount: 1_500_000,
        fromDate: daysFromNow(-30),
        toDate: daysFromNow(30),
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    realm.create<Wallet>(
      "Wallet",
      {
        _id: walletBankId,
        userId: user1Hex,
        name: "Ngân hàng A",
        type: "bank",
        amount: 5_200_000,
        fromDate: daysFromNow(-30),
        toDate: daysFromNow(30),
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    // 3) Categories (liên User, có cả income/expense)
    realm.create<Category>(
      "Category",
      {
        _id: catFoodId,
        name: "Ăn uống",
        userId: user1Hex,
        parentId: "",
        type: "expense",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    realm.create<Category>(
      "Category",
      {
        _id: catTransportId,
        name: "Di chuyển",
        userId: user1Hex,
        parentId: "",
        type: "expense",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    realm.create<Category>(
      "Category",
      {
        _id: catSalaryId,
        name: "Lương",
        userId: user1Hex,
        parentId: "",
        type: "income",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    // 4) Budgets (ví dụ 2 budget: Ăn uống + Di chuyển tháng này)
    realm.create<Budget>(
      "Budget",
      {
        _id: new Realm.BSON.ObjectId(),
        name: "Ăn uống tháng này",
        walletId: [walletCashHex], // mảng string
        categoryId: catFoodHex,
        amount: 3_000_000,
        remain: 0,
        loop: true,
        fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        toDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ),
        note: "Dành cho ăn uống",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    realm.create<Budget>(
      "Budget",
      {
        _id: new Realm.BSON.ObjectId(),
        name: "Di chuyển tháng này",
        walletId: [walletCashHex, walletBankHex],
        categoryId: catTransportHex,
        amount: 1_000_000,
        remain: 0,
        loop: true,
        fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        toDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ),
        note: "Taxi, xăng xe",
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );

    // 5) Transactions (income + expense mẫu)
    const trx = (
      walletHex: string,
      catHex: string,
      amount: number,
      type: "income" | "expense",
      note: string,
      dayOffset: number
    ) => ({
      _id: new Realm.BSON.ObjectId(),
      walletId: walletHex,
      categoryId: catHex,
      amount,
      type,
      note,
      createdAt: daysFromNow(dayOffset),
      updatedAt: daysFromNow(dayOffset),
    });

    [
      trx(
        walletBankHex,
        catSalaryHex,
        15_000_000,
        "income",
        "Lương tháng 9",
        -10
      ),
      trx(walletCashHex, catFoodHex, 120_000, "expense", "Bún chả", -9),
      trx(walletCashHex, catFoodHex, 65_000, "expense", "Cafe", -7),
      trx(walletCashHex, catTransportHex, 200_000, "expense", "Đổ xăng", -6),
      trx(walletBankHex, catFoodHex, 450_000, "expense", "Đi ăn với bạn", -3),
      trx(
        walletCashHex,
        catTransportHex,
        160_000,
        "expense",
        "GrapCar về nhà",
        -2
      ),
    ].forEach((t) => {
      realm.create<Transaction>("Transaction", t, Realm.UpdateMode.Modified);
    });

    // 6) Notifications
    realm.create<Notification>(
      "Notification",
      {
        _id: notif1Id,
        content: "Chào mừng bạn đến với app quản lý thu chi!",
        link: "",
        time: now(),
        isRead: false,
        createdAt: now(),
        updatedAt: now(),
      },
      Realm.UpdateMode.Modified
    );
  });

  await AsyncStorage.setItem(SEED_FLAG, "1");
}

export async function resetSeed(realm: Realm) {
  // chỉ dùng cho DEV
  realm.write(() => {
    realm.deleteAll();
  });
  await AsyncStorage.removeItem(SEED_FLAG);
}
