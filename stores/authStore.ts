import { databaseService } from "@/database/databaseService";
import { initializeUserData } from "@/database/seedData";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Helper function to sanitize email for use as SecureStore key
const sanitizeEmailForKey = (email: string): string => {
  return email.replace(/[^a-zA-Z0-9.\-_]/g, "_");
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      // Check if user exists in Realm database
      const realmUser = databaseService.getUserByEmail(email);
      if (!realmUser) {
        set({ isLoading: false });
        return false; // User doesn't exist
      }

      // Check stored password hash
      const sanitizedEmail = sanitizeEmailForKey(email);
      const storedCredentials = await SecureStore.getItemAsync(
        `credentials_${sanitizedEmail}`
      );

      if (storedCredentials) {
        const { hashedPassword } = JSON.parse(storedCredentials);
        const inputPasswordHash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password
        );

        if (hashedPassword === inputPasswordHash) {
          // Create user data for auth store
          const userData: User = {
            id: realmUser._id.toString(),
            email: realmUser.email,
            name: realmUser.name,
            createdAt: realmUser.createdAt,
          };

          // Generate a session token
          const token = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `${email}_${Date.now()}`
          );

          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
          await SecureStore.setItemAsync(
            USER_DATA_KEY,
            JSON.stringify(userData)
          );

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("Sign in error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });

      // Check if user already exists in Realm database
      const existingUser = databaseService.getUserByEmail(email);
      if (existingUser) {
        set({ isLoading: false });
        return false; // User already exists
      }

      // Hash the password
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      // Create user in Realm database
      const realmUser = databaseService.createUser(email, name);

      // Create user data for auth store
      const userData: User = {
        id: realmUser._id.toString(),
        email: realmUser.email,
        name: realmUser.name,
        createdAt: realmUser.createdAt,
      };

      // Store password hash securely (for authentication)
      const sanitizedEmail = sanitizeEmailForKey(email);
      const credentialsData = {
        hashedPassword,
        userId: realmUser._id.toString(),
      };

      await SecureStore.setItemAsync(
        `credentials_${sanitizedEmail}`,
        JSON.stringify(credentialsData)
      );

      // Generate a session token
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${email}_${Date.now()}`
      );

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

      // Initialize default data for new user
      await initializeUserData(realmUser._id.toString(), realmUser.name);

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("Sign up error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });

      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Check auth status error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
