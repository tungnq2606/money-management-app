import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-get-random-values"; // Must be first import for BSON crypto polyfill
import { useAuthStore } from "../stores/authStore";

export default function IndexScreen() {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const handleAuthFlow = async () => {
      // Check authentication status
      await checkAuthStatus();

      // Navigate based on authentication status
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/signin");
      }
    };

    handleAuthFlow();
  }, [isAuthenticated, checkAuthStatus]);

  // Show loading spinner while checking authentication
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
