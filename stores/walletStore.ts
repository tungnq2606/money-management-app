import { create } from "zustand";
import { Wallet } from "../database/schemas/Wallet";
import { getWalletService } from "../database/services";
import { CreateWalletData } from "../database/services/WalletService";

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
}

interface WalletActions {
  loadWallets: (userId: string) => Promise<void>;
  createWallet: (walletData: CreateWalletData) => Promise<boolean>;
  updateWallet: (
    walletId: string,
    updateData: Partial<CreateWalletData>
  ) => Promise<boolean>;
  deleteWallet: (walletId: string) => Promise<boolean>;
  selectWallet: (wallet: Wallet | null) => void;
  updateWalletAmount: (walletId: string, amount: number) => Promise<boolean>;
  clearError: () => void;
}

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  error: null,

  // Actions
  loadWallets: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const wallets = getWalletService().getWalletsByUserId(userId);
      set({
        wallets,
        isLoading: false,
      });
    } catch (error) {
      console.error("Load wallets error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to load wallets",
        isLoading: false,
      });
    }
  },

  createWallet: async (walletData: CreateWalletData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const wallet = getWalletService().createWallet(walletData);
      const { wallets } = get();

      set({
        wallets: [wallet, ...wallets],
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error("Create wallet error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to create wallet",
        isLoading: false,
      });
      return false;
    }
  },

  updateWallet: async (
    walletId: string,
    updateData: Partial<CreateWalletData>
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const updatedWallet = getWalletService().updateWallet(
        walletId,
        updateData
      );

      if (updatedWallet) {
        const { wallets, selectedWallet } = get();
        const updatedWallets = wallets.map((w) =>
          w._id.toString() === walletId ? updatedWallet : w
        );

        set({
          wallets: updatedWallets,
          selectedWallet:
            selectedWallet?._id.toString() === walletId
              ? updatedWallet
              : selectedWallet,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: "Wallet not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Update wallet error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to update wallet",
        isLoading: false,
      });
      return false;
    }
  },

  updateWalletAmount: async (
    walletId: string,
    amount: number
  ): Promise<boolean> => {
    try {
      const updatedWallet = getWalletService().updateWalletAmount(
        walletId,
        amount
      );

      if (updatedWallet) {
        const { wallets, selectedWallet } = get();
        const updatedWallets = wallets.map((w) =>
          w._id.toString() === walletId ? updatedWallet : w
        );

        set({
          wallets: updatedWallets,
          selectedWallet:
            selectedWallet?._id.toString() === walletId
              ? updatedWallet
              : selectedWallet,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update wallet amount error:", error);
      return false;
    }
  },

  deleteWallet: async (walletId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const success = getWalletService().deleteWallet(walletId);

      if (success) {
        const { wallets, selectedWallet } = get();
        const updatedWallets = wallets.filter(
          (w) => w._id.toString() !== walletId
        );

        set({
          wallets: updatedWallets,
          selectedWallet:
            selectedWallet?._id.toString() === walletId ? null : selectedWallet,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: "Wallet not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Delete wallet error:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete wallet",
        isLoading: false,
      });
      return false;
    }
  },

  selectWallet: (wallet: Wallet | null) => {
    set({ selectedWallet: wallet });
  },

  clearError: () => {
    set({ error: null });
  },
}));
