import { Notification } from "../schemas/Notification";
import { BaseService } from "./BaseService";

export interface CreateNotificationData {
  content: string;
  link?: string;
  time: Date;
  isRead?: boolean;
}

export interface UpdateNotificationData {
  content?: string;
  link?: string;
  time?: Date;
  isRead?: boolean;
}

export class NotificationService extends BaseService {
  protected schemaName = "Notification";

  async createNotification(
    notificationData: CreateNotificationData
  ): Promise<Notification> {
    return this.create<Notification>({
      ...notificationData,
      link: notificationData.link ?? "",
      isRead: notificationData.isRead ?? false,
    });
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return this.findById<Notification>(id);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.findAll<Notification>();
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return this.findByFilter<Notification>(`isRead == false`);
  }

  async getReadNotifications(): Promise<Notification[]> {
    return this.findByFilter<Notification>(`isRead == true`);
  }

  async getNotificationsInTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<Notification[]> {
    return this.findByFilter<Notification>(`time >= $0 AND time <= $1`);
  }

  async getRecentNotifications(limit: number = 10): Promise<Notification[]> {
    const allNotifications = await this.findAll<Notification>();
    return allNotifications
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit);
  }

  async updateNotification(
    id: string,
    updates: UpdateNotificationData
  ): Promise<Notification | null> {
    return this.update<Notification>(id, updates);
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.update<Notification>(id, { isRead: true });
  }

  async markAsUnread(id: string): Promise<Notification | null> {
    return this.update<Notification>(id, { isRead: false });
  }

  async markAllAsRead(): Promise<void> {
    const unreadNotifications = await this.getUnreadNotifications();

    const realm = await this.getRealm();
    realm.write(() => {
      unreadNotifications.forEach((notification) => {
        notification.isRead = true;
        notification.updatedAt = new Date();
      });
    });
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async deleteReadNotifications(): Promise<void> {
    const readNotifications = await this.getReadNotifications();

    const realm = await this.getRealm();
    realm.write(() => {
      realm.delete(readNotifications);
    });
  }

  async deleteOldNotifications(olderThanDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const oldNotifications = await this.findByFilter<Notification>(`time < $0`);

    const realm = await this.getRealm();
    realm.write(() => {
      realm.delete(oldNotifications);
    });
  }

  async searchNotificationsByContent(
    searchText: string
  ): Promise<Notification[]> {
    return this.findByFilter<Notification>(
      `content CONTAINS[c] "${searchText}"`
    );
  }

  async getUnreadCount(): Promise<number> {
    const unreadNotifications = await this.getUnreadNotifications();
    return unreadNotifications.length;
  }

  async getNotificationsByLink(link: string): Promise<Notification[]> {
    return this.findByFilter<Notification>(`link == "${link}"`);
  }

  async getTodaysNotifications(): Promise<Notification[]> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    return this.getNotificationsInTimeRange(startOfDay, endOfDay);
  }

  async getNotificationsFromLastWeek(): Promise<Notification[]> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return this.getNotificationsInTimeRange(weekAgo, now);
  }
}
