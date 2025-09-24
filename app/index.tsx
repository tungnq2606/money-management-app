import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // if (isAuthenticated && user) {
      router.replace("/(tabs)/home");
      // } else {
      //   router.replace("/signin");
      // }
    }
  }, [isAuthenticated, isLoading, user]);

  // const realm = useRealm();
  // useEffect(() => {
  //   seedRealmIfNeeded(realm).catch(console.error);
  // }, [realm]);

  // const users = useQuery(User);
  // const wallets = useQuery(Wallet);
  // const cats = useQuery(Category);
  // const budgets = useQuery(Budget);
  // const trxs = useQuery(Transaction);
  // const notifs = useQuery(Notification);

  // console.log(users, wallets, cats, budgets, trxs, notifs);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Manager</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      <Text style={styles.text}>Initializing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  loader: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#B3D9FF",
  },
});
