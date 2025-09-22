import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "@/components/HeaderApp";

const ProfileScreen = () => {
  const { user, signOut } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await signOut();
            router.replace("/signin");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {user && (
        <View style={styles.userInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phoneNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{user.address}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Birthday:</Text>
            <Text style={styles.value}>
              {new Date(user.birthday).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.signOutButton,
              isLoggingOut && styles.buttonDisabled,
            ]}
            onPress={handleSignOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  userInfo: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
