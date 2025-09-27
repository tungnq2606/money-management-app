import { create } from "zustand";
import { Notification } from "../database/schemas/Notification";
import { getGlobalNotificationService } from "../database/services";
import { CreateNotificationData } from "../database/services/NotificationService";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  // Fetch notifications
  fetchNotifications: (userId: string) => Promise<void>;
  fetchUnreadNotifications: (userId: string) => Promise<void>;

  // Create notification
  createNotification: (
    notificationData: CreateNotificationData
  ) => Promise<Notification | null>;

  // Mark as read
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: (userId: string) => Promise<number>;

  // Update notification
  updateNotification: (
    notificationId: string,
    updateData: Partial<CreateNotificationData>
  ) => Promise<boolean>;

  // Delete notification
  deleteNotification: (notificationId: string) => Promise<boolean>;
  deleteAllNotifications: () => Promise<number>;

  // Utility actions
  clearError: () => void;
  refreshNotifications: (userId: string) => Promise<void>;
  getNotificationById: (notificationId: string) => Notification | null;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Actions
  fetchNotifications: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const notifications = service.getNotificationsByUser(userId);
      const unreadNotifications = service.getUnreadNotificationsByUser(userId);

      set({
        notifications,
        unreadCount: unreadNotifications.length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
        isLoading: false,
      });
    }
  },

  fetchUnreadNotifications: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const unreadNotifications = service.getUnreadNotificationsByUser(userId);

      set({
        unreadCount: unreadNotifications.length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch unread notifications",
        isLoading: false,
      });
    }
  },

  createNotification: async (
    notificationData: CreateNotificationData
  ): Promise<Notification | null> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const notification = service.createNotification(notificationData);

      // Update local state
      const { notifications } = get();
      const updatedNotifications = [notification, ...notifications];

      set({
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
        isLoading: false,
        error: null,
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create notification",
        isLoading: false,
      });
      return null;
    }
  },

  markAsRead: async (notificationId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const updatedNotification = service.markAsRead(notificationId);

      if (updatedNotification) {
        // Update local state
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) =>
          notification._id.toString() === notificationId
            ? { ...notification, isRead: true, updatedAt: new Date() }
            : notification
        );

        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        set({
          error: "Notification not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
        isLoading: false,
      });
      return false;
    }
  },

  markAllAsRead: async (userId: string): Promise<number> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const markedCount = service.markAllAsRead();

      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
        updatedAt: new Date(),
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
        isLoading: false,
        error: null,
      });

      return markedCount;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read",
        isLoading: false,
      });
      return 0;
    }
  },

  updateNotification: async (
    notificationId: string,
    updateData: Partial<CreateNotificationData>
  ): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const updatedNotification = service.updateNotification(
        notificationId,
        updateData
      );

      if (updatedNotification) {
        // Update local state
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) =>
          notification._id.toString() === notificationId
            ? { ...notification, ...updateData, updatedAt: new Date() }
            : notification
        );

        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        set({
          error: "Notification not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update notification",
        isLoading: false,
      });
      return false;
    }
  },

  deleteNotification: async (notificationId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const success = service.deleteNotification(notificationId);

      if (success) {
        // Update local state
        const { notifications } = get();
        const updatedNotifications = notifications.filter(
          (notification) => notification._id.toString() !== notificationId
        );

        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        set({
          error: "Notification not found",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete notification",
        isLoading: false,
      });
      return false;
    }
  },

  deleteAllNotifications: async (): Promise<number> => {
    set({ isLoading: true, error: null });

    try {
      const service = getGlobalNotificationService();
      const deletedCount = service.deleteAllNotifications();

      set({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
      });

      return deletedCount;
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete all notifications",
        isLoading: false,
      });
      return 0;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  refreshNotifications: async (userId: string): Promise<void> => {
    await get().fetchNotifications(userId);
  },

  getNotificationById: (notificationId: string): Notification | null => {
    const { notifications } = get();
    return (
      notifications.find(
        (notification) => notification._id.toString() === notificationId
      ) || null
    );
  },
}));
