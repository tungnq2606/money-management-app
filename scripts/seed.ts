#!/usr/bin/env tsx

import * as Crypto from "expo-crypto";
import {
  getBudgetService,
  getCategoryService,
  getNotificationService,
  getTransactionService,
  getUserService,
  getWalletService,
  initializeDatabase,
} from "../database/services";

// Sample data
const sampleUsers = [
  {
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    password: "123456",
    birthday: new Date("1990-05-15"),
    phoneNumber: 1234567890,
    address: "123 Đường ABC, Quận 1, TP.HCM",
  },
  {
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    password: "123456",
    birthday: new Date("1995-08-22"),
    phoneNumber: 9876543210,
    address: "456 Đường XYZ, Quận 3, TP.HCM",
  },
  {
    name: "Lê Minh Cường",
    email: "cuong.le@example.com",
    password: "123456",
    birthday: new Date("1988-12-10"),
    phoneNumber: 5555555555,
    address: "789 Đường DEF, Quận 7, TP.HCM",
  },
];

const sampleWallets = [
  {
    name: "Ví Tiền Mặt",
    type: "cash",
    amount: 500000,
  },
  {
    name: "Ngân Hàng ACB",
    type: "bank",
    amount: 2500000,
  },
  {
    name: "Thẻ Tín Dụng",
    type: "credit",
    amount: -500000,
  },
  {
    name: "Ví MoMo",
    type: "e-wallet",
    amount: 300000,
  },
  {
    name: "Tài Khoản Tiết Kiệm",
    type: "savings",
    amount: 5000000,
  },
];

const sampleTransactions = [
  // Income transactions
  {
    amount: 15000000,
    type: "income" as const,
    note: "Lương tháng 12/2024",
    categoryName: "Salary",
  },
  {
    amount: 2000000,
    type: "income" as const,
    note: "Thưởng cuối năm",
    categoryName: "Salary",
  },
  {
    amount: 500000,
    type: "income" as const,
    note: "Bán đồ cũ",
    categoryName: "Other Income",
  },

  // Expense transactions
  {
    amount: 800000,
    type: "expense" as const,
    note: "Ăn uống tuần này",
    categoryName: "Food & Dining",
  },
  {
    amount: 200000,
    type: "expense" as const,
    note: "Xăng xe",
    categoryName: "Transportation",
  },
  {
    amount: 1500000,
    type: "expense" as const,
    note: "Mua quần áo",
    categoryName: "Shopping",
  },
  {
    amount: 300000,
    type: "expense" as const,
    note: "Xem phim",
    categoryName: "Entertainment",
  },
  {
    amount: 1200000,
    type: "expense" as const,
    note: "Tiền điện nước",
    categoryName: "Bills & Utilities",
  },
  {
    amount: 500000,
    type: "expense" as const,
    note: "Khám bệnh",
    categoryName: "Healthcare",
  },
  {
    amount: 800000,
    type: "expense" as const,
    note: "Học phí khóa học",
    categoryName: "Education",
  },
];

const sampleBudgets = [
  {
    name: "Ngân sách Ăn uống",
    amount: 2000000,
    categoryName: "Food & Dining",
    note: "Ngân sách ăn uống hàng tháng",
  },
  {
    name: "Ngân sách Mua sắm",
    amount: 3000000,
    categoryName: "Shopping",
    note: "Ngân sách mua sắm quần áo, đồ dùng",
  },
  {
    name: "Ngân sách Giải trí",
    amount: 1000000,
    categoryName: "Entertainment",
    note: "Ngân sách giải trí, xem phim, du lịch",
  },
  {
    name: "Ngân sách Giao thông",
    amount: 800000,
    categoryName: "Transportation",
    note: "Ngân sách xăng xe, taxi, grab",
  },
];

const sampleNotifications = [
  {
    content:
      "Chào mừng bạn đến với Money Manager! Hãy bắt đầu quản lý tài chính của bạn.",
    link: "/home",
    isRead: false,
  },
  {
    content:
      "Bạn đã vượt quá ngân sách Ăn uống tháng này. Hãy kiểm soát chi tiêu tốt hơn!",
    link: "/budget",
    isRead: false,
  },
  {
    content: "Nhắc nhở: Hóa đơn điện nước sắp đến hạn thanh toán.",
    link: "/transaction",
    isRead: true,
  },
  {
    content: "Bạn có 1 giao dịch mới được thêm vào ví Ngân Hàng ACB.",
    link: "/transaction",
    isRead: true,
  },
];

async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

async function createSampleData() {
  try {
    console.log("🚀 Bắt đầu tạo dữ liệu mẫu...");

    // Initialize database
    await initializeDatabase();
    console.log("✅ Database đã được khởi tạo");

    const userService = getUserService();
    const walletService = getWalletService();
    const categoryService = getCategoryService();
    const transactionService = getTransactionService();
    const budgetService = getBudgetService();
    const notificationService = getNotificationService();

    // Create sample users
    console.log("👥 Đang tạo users mẫu...");
    const createdUsers = [];

    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = userService.getUserByEmail(userData.email);
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} đã tồn tại, bỏ qua...`);
        createdUsers.push(existingUser);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);
      const user = userService.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Create default categories for user
      categoryService.createDefaultCategories(user._id.toString());

      createdUsers.push(user);
      console.log(`✅ Đã tạo user: ${user.name} (${user.email})`);
    }

    // Create sample wallets for each user
    console.log("💰 Đang tạo wallets mẫu...");
    const allWallets = [];

    for (const user of createdUsers) {
      const userWallets = [];

      for (let i = 0; i < sampleWallets.length; i++) {
        const walletData = sampleWallets[i];
        const currentDate = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(currentDate.getFullYear() + 1);

        const wallet = walletService.createWallet({
          userId: user._id.toString(),
          name: `${walletData.name} - ${user.name}`,
          type: walletData.type,
          amount: walletData.amount,
          fromDate: currentDate,
          toDate: nextYear,
        });

        userWallets.push(wallet);
        allWallets.push(wallet);
      }

      console.log(
        `✅ Đã tạo ${userWallets.length} wallets cho user: ${user.name}`
      );
    }

    // Create sample transactions
    console.log("💳 Đang tạo transactions mẫu...");
    let transactionCount = 0;

    for (const user of createdUsers) {
      const userWallets = walletService.getWalletsByUserId(user._id.toString());
      const userCategories = categoryService.getCategoriesByUserId(
        user._id.toString()
      );

      if (userWallets.length === 0 || userCategories.length === 0) {
        console.log(
          `⚠️  User ${user.name} không có wallets hoặc categories, bỏ qua...`
        );
        continue;
      }

      // Create 5-8 random transactions per user
      const numTransactions = Math.floor(Math.random() * 4) + 5;

      for (let i = 0; i < numTransactions; i++) {
        const transactionData =
          sampleTransactions[
            Math.floor(Math.random() * sampleTransactions.length)
          ];
        const randomWallet =
          userWallets[Math.floor(Math.random() * userWallets.length)];
        const category = userCategories.find(
          (cat) => cat.name === transactionData.categoryName
        );

        if (!category) continue;

        // Random date within last 30 days
        const randomDate = new Date();
        randomDate.setDate(
          randomDate.getDate() - Math.floor(Math.random() * 30)
        );

        const transaction = transactionService.createTransaction({
          walletId: randomWallet._id.toString(),
          categoryId: category._id.toString(),
          amount: transactionData.amount,
          type: transactionData.type,
          note: transactionData.note,
        });

        // Update wallet amount
        const newAmount =
          randomWallet.amount +
          (transactionData.type === "income"
            ? transactionData.amount
            : -transactionData.amount);
        walletService.updateWalletAmount(
          randomWallet._id.toString(),
          newAmount
        );

        transactionCount++;
      }

      console.log(
        `✅ Đã tạo ${numTransactions} transactions cho user: ${user.name}`
      );
    }

    // Create sample budgets
    console.log("📊 Đang tạo budgets mẫu...");
    let budgetCount = 0;

    for (const user of createdUsers) {
      const userWallets = walletService.getWalletsByUserId(user._id.toString());
      const userCategories = categoryService.getCategoriesByUserId(
        user._id.toString()
      );

      if (userWallets.length === 0 || userCategories.length === 0) continue;

      // Create 2-3 budgets per user
      const numBudgets = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < numBudgets; i++) {
        const budgetData =
          sampleBudgets[Math.floor(Math.random() * sampleBudgets.length)];
        const category = userCategories.find(
          (cat) => cat.name === budgetData.categoryName
        );

        if (!category) continue;

        const currentDate = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Select 1-2 random wallets
        const selectedWallets = userWallets
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1)
          .map((w) => w._id.toString());

        const budget = budgetService.createBudget({
          name: `${budgetData.name} - ${user.name}`,
          walletId: selectedWallets,
          categoryId: category._id.toString(),
          amount: budgetData.amount,
          remain: budgetData.amount,
          loop: true,
          fromDate: currentDate,
          toDate: nextMonth,
          note: budgetData.note,
        });

        budgetCount++;
      }

      console.log(`✅ Đã tạo ${numBudgets} budgets cho user: ${user.name}`);
    }

    // Create sample notifications
    console.log("🔔 Đang tạo notifications mẫu...");
    let notificationCount = 0;

    for (const user of createdUsers) {
      for (const notificationData of sampleNotifications) {
        const notification = notificationService.createNotification({
          content: notificationData.content,
          link: notificationData.link,
          time: new Date(),
          isRead: notificationData.isRead,
        });

        notificationCount++;
      }
    }

    console.log(`✅ Đã tạo ${notificationCount} notifications`);

    // Summary
    console.log("\n🎉 Hoàn thành tạo dữ liệu mẫu!");
    console.log("📊 Tổng kết:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   💰 Wallets: ${allWallets.length}`);
    console.log(`   💳 Transactions: ${transactionCount}`);
    console.log(`   📊 Budgets: ${budgetCount}`);
    console.log(`   🔔 Notifications: ${notificationCount}`);

    console.log("\n🔑 Thông tin đăng nhập:");
    for (const user of createdUsers) {
      console.log(`   Email: ${user.email} | Password: 123456`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi tạo dữ liệu mẫu:", error);
    throw error;
  }
}

async function resetDatabase() {
  try {
    console.log("🗑️  Đang reset database...");

    // Initialize database
    await initializeDatabase();

    const userService = getUserService();
    const walletService = getWalletService();
    const categoryService = getCategoryService();
    const transactionService = getTransactionService();
    const budgetService = getBudgetService();
    const notificationService = getNotificationService();

    // Get all data
    const users = userService.getAllUsers?.() || [];
    const wallets = walletService.getAllWallets?.() || [];
    const categories = categoryService.getAllCategories?.() || [];
    const transactions = transactionService.getAllTransactions?.() || [];
    const budgets = budgetService.getAllBudgets?.() || [];
    const notifications = notificationService.getAllNotifications?.() || [];

    // Delete all data
    for (const transaction of transactions) {
      transactionService.deleteTransaction(transaction._id.toString());
    }

    for (const budget of budgets) {
      budgetService.deleteBudget(budget._id.toString());
    }

    for (const wallet of wallets) {
      walletService.deleteWallet(wallet._id.toString());
    }

    for (const category of categories) {
      categoryService.deleteCategory(category._id.toString());
    }

    for (const notification of notifications) {
      notificationService.deleteNotification(notification._id.toString());
    }

    for (const user of users) {
      userService.deleteUser(user._id.toString());
    }

    console.log("✅ Đã reset database thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi reset database:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case "init":
        await createSampleData();
        break;
      case "reset":
        await resetDatabase();
        break;
      default:
        console.log("📖 Cách sử dụng:");
        console.log("   npm run seed:init  - Tạo dữ liệu mẫu");
        console.log("   npm run seed:reset - Reset toàn bộ database");
        break;
    }
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { createSampleData, resetDatabase };
