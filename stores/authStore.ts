import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../database/schemas/User";
import {
  getCategoryService,
  getUserService,
  getWalletService,
} from "../database/services";
import { CreateUserData, SignInData } from "../database/services/UserService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: CreateUserData) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<CreateUserData>) => Promise<boolean>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      signIn: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const signInData: SignInData = { email, password };
          const user = await getUserService().signIn(signInData);

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
            error: error instanceof Error ? error.message : "Sign in failed",
            isLoading: false,
          });
          return false;
        }
      },

      signUp: async (userData: CreateUserData): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Check if user already exists
          const existingUser = getUserService().getUserByEmail(userData.email);
          if (existingUser) {
            set({
              error: "User with this email already exists",
              isLoading: false,
            });
            return false;
          }

          // Create new user
          const user = await getUserService().createUser(userData);

          // Create default categories for the new user
          getCategoryService().createDefaultCategories(user._id.toString());

          // Create a default wallet for the new user
          const currentDate = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(currentDate.getFullYear() + 1);

          getWalletService().createWallet({
            userId: user._id.toString(),
            name: "My Wallet",
            type: "cash",
            amount: 0,
            fromDate: currentDate,
            toDate: nextYear,
          });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.error("Sign up error:", error);
          set({
            error: error instanceof Error ? error.message : "Sign up failed",
            isLoading: false,
          });
          return false;
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: async (
        userData: Partial<CreateUserData>
      ): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        set({ isLoading: true, error: null });

        try {
          const updatedUser = getUserService().updateUser(
            user._id.toString(),
            userData
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
            error: error instanceof Error ? error.message : "Update failed",
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
