import { databaseService } from "./databaseService";

export const seedDefaultCategories = async (userId: string) => {
  try {
    // Check if categories already exist
    const existingCategories = databaseService.getUserCategories(userId);
    if (existingCategories.length > 0) {
      console.log("Categories already exist for user");
      return;
    }

    // Default expense categories
    const expenseCategories = [
      { name: "Food & Dining", color: "#FF6B35", icon: "restaurant" },
      { name: "Transportation", color: "#4ECDC4", icon: "car" },
      { name: "Shopping", color: "#45B7D1", icon: "bag" },
      { name: "Entertainment", color: "#96CEB4", icon: "tv" },
      { name: "Bills & Utilities", color: "#FECA57", icon: "receipt" },
      { name: "Healthcare", color: "#FF9FF3", icon: "medical" },
      { name: "Education", color: "#54A0FF", icon: "book" },
      { name: "Groceries", color: "#5F27CD", icon: "basket" },
    ];

    // Default income categories
    const incomeCategories = [
      { name: "Salary", color: "#00D2D3", icon: "card" },
      { name: "Freelance", color: "#FF9F43", icon: "briefcase" },
      { name: "Investment", color: "#01A3A4", icon: "trending-up" },
      { name: "Gift", color: "#FF6348", icon: "gift" },
      { name: "Other Income", color: "#2ED573", icon: "plus" },
    ];

    // Create expense categories
    for (const category of expenseCategories) {
      databaseService.createCategory(
        userId,
        category.name,
        "expense",
        category.color,
        category.icon
      );
    }

    // Create income categories
    for (const category of incomeCategories) {
      databaseService.createCategory(
        userId,
        category.name,
        "income",
        category.color,
        category.icon
      );
    }

    console.log(
      `Created ${
        expenseCategories.length + incomeCategories.length
      } default categories for user`
    );
  } catch (error) {
    console.error("Error seeding default categories:", error);
  }
};

export const createDefaultAccount = async (
  userId: string,
  userName: string
) => {
  try {
    // Check if accounts already exist
    const existingAccounts = databaseService.getUserAccounts(userId);
    if (existingAccounts.length > 0) {
      console.log("Accounts already exist for user");
      return;
    }

    // Create a default checking account
    databaseService.createAccount(
      userId,
      `${userName}'s Checking`,
      "checking",
      0,
      "USD"
    );

    console.log("Created default checking account for user");
  } catch (error) {
    console.error("Error creating default account:", error);
  }
};

export const initializeUserData = async (userId: string, userName: string) => {
  try {
    await Promise.all([
      seedDefaultCategories(userId),
      createDefaultAccount(userId, userName),
    ]);
    console.log("User data initialization completed");
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
};
