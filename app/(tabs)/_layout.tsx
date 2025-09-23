import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/stores/authStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import BudgetScreen from "./budget";
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import TransactionScreen from "./transaction";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/signin");
    }
  }, [isAuthenticated, user]);

  const _renderIcon = (routeName: string, selectedTab: string) => {
    const color =
      selectedTab === routeName
        ? Colors[colorScheme ?? "light"].tint
        : "#92898A";

    switch (routeName) {
      case "home":
        return <AntDesign name="home" size={24} color={color} />;
      case "transaction":
        return <AntDesign name="swap" size={24} color={color} />;
      case "budget":
        return <Feather name="pie-chart" size={24} color={color} />;
      case "profile":
        return <AntDesign name="user" size={24} color={color} />;
      default:
        return <AntDesign name="home" size={24} color={color} />;
    }
  };

  const renderTabBar = ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (tab: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabBarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      height={65}
      circleWidth={50}
      bgColor="#FFFFFF"
      initialRouteName="home"
      borderTopLeftRight
      width={undefined}
      borderColor="#DDDDDD"
      borderWidth={0}
      circlePosition="CENTER"
      id="curved-bottom-bar"
      screenListeners={undefined}
      screenOptions={{
        headerShown: false,
      }}
      defaultScreenOptions={undefined}
      backBehavior="history"
      renderCircle={({
        selectedTab,
        navigate,
      }: {
        selectedTab: string;
        navigate: (tab: string) => void;
      }) => (
        <View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.btnCircle}
            onPress={() => router.push("/addWallet")}
          >
            <AntDesign name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen
        name="home"
        position="LEFT"
        component={HomeScreen}
      />
      <CurvedBottomBarExpo.Screen
        name="transaction"
        position="LEFT"
        component={TransactionScreen}
      />
      <CurvedBottomBarExpo.Screen
        name="budget"
        position="RIGHT"
        component={BudgetScreen}
      />
      <CurvedBottomBarExpo.Screen
        name="profile"
        position="RIGHT"
        component={ProfileScreen}
      />
    </CurvedBottomBarExpo.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {},
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
  },
});
