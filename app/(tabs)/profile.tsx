import HeaderApp from "@/components/HeaderApp";
import { useWalletStore } from "@/stores";
import { useAuthStore } from "@/stores/authStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { user, signOut } = useAuthStore();
  const { loadWallets } = useWalletStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadWallets(String(user?._id));
  }, []);

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
      <HeaderApp title={"Profile"} />
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=4" }}
            style={{ width: 90, height: 90, borderRadius: 45 }}
          />
        </View>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>Username</Text>
          <Text style={styles.txtName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/detailProfile")}>
          <Feather name="edit-2" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.viewBody}>
        {data_profile.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.touchItem,
              {
                borderBottomWidth: index === data_profile.length - 1 ? 0 : 1,
                borderBottomColor: "#dcdcdcff",
              },
            ]}
            onPress={() => {
              if (item.title === "Wallet") {
                router.push("/wallet");
              } else if (item.title === "Logout") {
                handleSignOut();
              }
            }}
          >
            {item?.icon === "wallet" ? (
              <View
                style={[
                  styles.viewIcon,
                  {
                    backgroundColor: "#EEE5FF",
                  },
                ]}
              >
                <Ionicons name="wallet" size={24} color="#7F3DFF" />
              </View>
            ) : (
              <View
                style={[
                  styles.viewIcon,
                  {
                    backgroundColor: "#FFE2E4",
                  },
                ]}
              >
                <MaterialIcons name="logout" size={24} color="red" />
              </View>
            )}
            <Text style={styles.txtItem}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    marginBottom: 30,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#AD00FF",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  txtName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  userNameContainer: {
    width: "60%",
  },
  viewBody: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  touchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  txtItem: {
    fontSize: 16,
    marginLeft: 16,
  },
  viewIcon: {
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

const data_profile = [
  {
    id: 1,
    title: "Wallet",
    icon: "wallet",
  },
  {
    id: 2,
    title: "Logout",
    icon: "logout",
  },
];
