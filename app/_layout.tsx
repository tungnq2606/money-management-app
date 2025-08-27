import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { DatabaseProvider } from "@/providers/DatabaseProvider";
import { useAuthStore } from "@/stores/authStore";

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Money Manager</Text>
      <Text style={styles.loadingSubtext}>Loading...</Text>
    </View>
  );
}

function AuthNavigator() {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check authentication status
        await checkAuthStatus();

        setIsInitialized(true);
      } catch (error) {
        console.error("App initialization error:", error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (isAuthenticated) {
        // router.replace("/(authenticated)/home");
        router.replace("/(tabs)/home");
      } else {
        router.replace("/signin");
      }
    }
  }, [isAuthenticated, isLoading, isInitialized]);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(authenticated)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <DatabaseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  loadingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: "#B3D9FF",
  },
});
