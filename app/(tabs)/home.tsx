import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../stores/authStore";

const HomeScreen = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome{user ? `, ${user.name}` : ""}!
          </Text>
          <Text style={styles.subtitle}>
            {isAuthenticated
              ? "Here's your financial overview"
              : "Please sign in to continue"}
          </Text>
        </View>

        {/* Add your financial dashboard content here */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Your financial dashboard will be displayed here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
