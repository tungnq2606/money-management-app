import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderApp from "../components/HeaderApp";
import { Colors } from "../constants/Colors";
import { useAuthStore, useNotificationStore } from "../stores";

function formatTime(date: Date): string {
  try {
    const d = new Date(date);
    const h = `${d.getHours()}`.padStart(2, "0");
    const m = `${d.getMinutes()}`.padStart(2, "0");
    return `${h}.${m}`;
  } catch {
    return "";
  }
}

export default function NotificationScreen() {
  const isFocused = useIsFocused();
  const user = useAuthStore((s) => s.user);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
  } = useNotificationStore();

  useEffect(() => {
    if (user && isFocused) {
      fetchNotifications(user._id.toString());
    }
  }, [isFocused, user, fetchNotifications]);

  const empty = useMemo(() => notifications.length === 0, [notifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (user && unreadCount > 0) {
      Alert.alert(
        "Mark All as Read",
        "Are you sure you want to mark all notifications as read?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Mark All",
            onPress: async () => {
              await markAllAsRead(user._id.toString());
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderApp
        title={`Notification${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
        isBack={true}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={clearError}
            style={styles.clearErrorButton}
          >
            <Text style={styles.clearErrorText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark All as Read</Text>
          </TouchableOpacity>
        </View>
      )}

      {empty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={() => user && fetchNotifications(user._id.toString())}
          renderItem={({ item, index }) => {
            const time = formatTime(item.time);
            return (
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    borderBottomWidth:
                      index === notifications.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
                    backgroundColor: item.isRead ? "#fff" : "#f8f9fa",
                  },
                ]}
                onPress={() =>
                  !item.isRead && handleMarkAsRead(item._id.toString())
                }
                activeOpacity={0.7}
              >
                <View style={styles.rowTexts}>
                  <Text
                    style={[
                      styles.title,
                      { fontWeight: item.isRead ? "400" : "600" },
                    ]}
                    numberOfLines={2}
                  >
                    {item.content}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.link || "No additional details"}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>{time}</Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    padding: 4,
  },
  clearErrorText: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600",
  },
  markAllContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  markAllButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  markAllText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderColor: Colors.border,
  },
  rowTexts: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});
