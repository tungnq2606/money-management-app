import Realm from "realm";
import { Notification } from "../schemas/Notification";

export interface CreateNotificationData {
  content: string;
  link?: string;
  time: Date;
  isRead?: boolean;
  userId: string;
}

class NotificationService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  createNotification(notificationData: CreateNotificationData): Notification {
    try {
      const now = new Date();
      const notification = this.realm.write(() => {
        return this.realm.create<Notification>("Notification", {
          _id: new Realm.BSON.ObjectId(),
          content: notificationData.content,
          link: notificationData.link || "",
          time: notificationData.time,
          isRead: notificationData.isRead || false,
          createdAt: now,
          updatedAt: now,
          userId: notificationData.userId,
        });
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  getAllNotifications(): Notification[] {
    try {
      return Array.from(
        this.realm.objects<Notification>("Notification").sorted("time", true)
      );
    } catch (error) {
      console.error("Error getting all notifications:", error);
      throw error;
    }
  }

  getNotificationsByUser(userId: string): Notification[] {
    try {
      return Array.from(
        this.realm
          .objects<Notification>("Notification")
          .filtered("userId == $0", userId)
          .sorted("time", true)
      );
    } catch (error) {
      console.error("Error getting notifications by user:", error);
      throw error;
    }
  }

  getUnreadNotificationsByUser(userId: string): Notification[] {
    try {
      return Array.from(
        this.realm
          .objects<Notification>("Notification")
          .filtered("userId == $0 AND isRead == false", userId)
          .sorted("time", true)
      );
    } catch (error) {
      console.error("Error getting unread notifications by user:", error);
      throw error;
    }
  }

  getUnreadNotifications(): Notification[] {
    try {
      return Array.from(
        this.realm
          .objects<Notification>("Notification")
          .filtered("isRead == false")
          .sorted("time", true)
      );
    } catch (error) {
      console.error("Error getting unread notifications:", error);
      throw error;
    }
  }

  getNotificationById(notificationId: string): Notification | null {
    try {
      const notification = this.realm
        .objects<Notification>("Notification")
        .filtered("_id == $0", new Realm.BSON.ObjectId(notificationId))[0];

      return notification || null;
    } catch (error) {
      console.error("Error getting notification by ID:", error);
      throw error;
    }
  }

  markAsRead(notificationId: string): Notification | null {
    try {
      const notification = this.getNotificationById(notificationId);
      if (!notification) return null;

      this.realm.write(() => {
        notification.isRead = true;
        notification.updatedAt = new Date();
      });

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  markAllAsRead(): number {
    try {
      const unreadNotifications = this.getUnreadNotifications();

      this.realm.write(() => {
        unreadNotifications.forEach((notification) => {
          notification.isRead = true;
          notification.updatedAt = new Date();
        });
      });

      return unreadNotifications.length;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  updateNotification(
    notificationId: string,
    updateData: Partial<CreateNotificationData>
  ): Notification | null {
    try {
      const notification = this.getNotificationById(notificationId);
      if (!notification) return null;

      this.realm.write(() => {
        if (updateData.content) notification.content = updateData.content;
        if (updateData.link !== undefined) notification.link = updateData.link;
        if (updateData.time) notification.time = updateData.time;
        if (updateData.isRead !== undefined)
          notification.isRead = updateData.isRead;
        notification.updatedAt = new Date();
      });

      return notification;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  deleteNotification(notificationId: string): boolean {
    try {
      const notification = this.getNotificationById(notificationId);
      if (!notification) return false;

      this.realm.write(() => {
        this.realm.delete(notification);
      });

      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  deleteAllNotifications(): number {
    try {
      const notifications = this.getAllNotifications();

      this.realm.write(() => {
        this.realm.delete(notifications);
      });

      return notifications.length;
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      throw error;
    }
  }

  getNotificationCount(): { total: number; unread: number } {
    try {
      const total = this.realm.objects<Notification>("Notification").length;
      const unread = this.realm
        .objects<Notification>("Notification")
        .filtered("isRead == false").length;

      return { total, unread };
    } catch (error) {
      console.error("Error getting notification count:", error);
      throw error;
    }
  }
}

export default NotificationService;
