import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values"; // Must be first import for BSON crypto polyfill
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../database/schemas/User";

// Custom storage implementation for Expo SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error("Error reading from SecureStore:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("Error writing to SecureStore:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("Error removing from SecureStore:", error);
    }
  },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    birthday: Date;
    phoneNumber: number;
    address: string;
  }) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      signIn: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const user = await userService.authenticateUser(email, password);

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: "Invalid email or password",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error("Sign in error:", error);
          set({
            error: "An error occurred during sign in",
            isLoading: false,
          });
          return false;
        }
      },

      signUp: async (userData): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Check if user already exists
          const existingUser = await userService.getUserByEmail(userData.email);
          if (existingUser) {
            set({
              error: "An account with this email already exists",
              isLoading: false,
            });
            return false;
          }

          // Create new user
          const newUser = await userService.createUser(userData);

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.error("Sign up error:", error);
          set({
            error: "An error occurred during sign up",
            isLoading: false,
          });
          return false;
        }
      },

      signOut: async (): Promise<void> => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuthStatus: async (): Promise<void> => {
        const { user } = get();

        if (user) {
          try {
            // Verify user still exists in database
            const currentUser = await userService.getUserById(
              user._id.toString()
            );
            if (currentUser) {
              set({
                user: currentUser,
                isAuthenticated: true,
              });
            } else {
              // User no longer exists, sign out
              set({
                user: null,
                isAuthenticated: false,
              });
            }
          } catch (error) {
            console.error("Auth check error:", error);
            // On error, maintain current state but log the issue
          }
        }
      },

      updateUser: async (updates: Partial<User>): Promise<boolean> => {
        const { user } = get();

        if (!user) {
          set({ error: "No user logged in" });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await userService.updateUser(
            user._id.toString(),
            updates
          );

          if (updatedUser) {
            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: "Failed to update user",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error("Update user error:", error);
          set({
            error: "An error occurred while updating user",
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => secureStorage),
      // Only persist user data and authentication status
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
