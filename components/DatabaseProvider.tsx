import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { initializeDatabase } from "../database/services";

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize database"
        );
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Database...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
