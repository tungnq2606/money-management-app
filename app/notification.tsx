import HeaderApp from "@/components/HeaderApp";
import { Colors } from "@/constants/Colors";
import { getGlobalNotificationService } from "@/database/services";
import { useAuthStore } from "@/stores/authStore";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface NotificationItem {
  _id: string;
  content: string;
  link: string;
  time: Date;
  isRead: boolean;
}

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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const isFocused = useIsFocused();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    try {
      const service = getGlobalNotificationService();
      const data = user
        ? (service.getNotificationsByUser(
            user._id.toString()
          ) as unknown as NotificationItem[])
        : [];
      setNotifications(data);
    } catch {
      // noop
    }
  }, [isFocused, user]);

  const empty = useMemo(() => notifications.length === 0, [notifications]);

  return (
    <View style={styles.container}>
      <HeaderApp title="Notification" isBack={true} />

      {empty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const time = formatTime(item.time);
            return (
              <View
                style={[
                  styles.row,
                  {
                    borderBottomWidth:
                      index === notifications.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <View style={styles.rowTexts}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.content}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.content}
                  </Text>
                </View>
                <Text style={styles.time}>{time}</Text>
              </View>
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
  time: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
  },
});
