import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "react-native-get-random-values"; // Must be first import for BSON crypto polyfill
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { useAuthStore } from "../stores/authStore";

export default function AuthNavigator() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Check authentication status when app loads
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <DatabaseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </DatabaseProvider>
  );
}
