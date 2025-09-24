import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

interface HeaderProps {
  title: string;
  isBack?: boolean;
  actionBack?: () => void;
  rightComponent?: React.ReactNode;
}

export default function HeaderApp({
  title,
  isBack = false,
  actionBack,
  rightComponent,
}: HeaderProps) {
  const router = useRouter();
  const canGoBack = router.canGoBack();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {canGoBack && isBack ? (
          <TouchableOpacity
            onPress={() => {
              if (actionBack) {
                actionBack();
              } else {
                router.back();
              }
            }}
            style={styles.backButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {rightComponent ? rightComponent : <View style={styles.backButton} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
