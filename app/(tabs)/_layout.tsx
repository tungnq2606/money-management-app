import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/stores/authStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import BudgetScreen from "./budget";
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import TransactionScreen from "./transaction";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuthStore();
  const [isFloatingMenuVisible, setIsFloatingMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/signin");
    }
  }, [isAuthenticated, user]);

  const toggleFloatingMenu = () => {
    const toValue = isFloatingMenuVisible ? 0 : 1;
    setIsFloatingMenuVisible(!isFloatingMenuVisible);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
  };

  const handleIncomePress = () => {
    setIsFloatingMenuVisible(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
    // Navigate to add income
    router.push("/addWallet?type=income");
  };

  const handleExpensePress = () => {
    setIsFloatingMenuVisible(false);
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
    // Navigate to add expense
    router.push("/addWallet?type=expense");
  };

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
    <>
      {/* Full Screen Backdrop for floating menu */}
      {isFloatingMenuVisible && (
        <TouchableOpacity
          style={styles.fullScreenBackdrop}
          activeOpacity={1}
          onPress={toggleFloatingMenu}
        />
      )}

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
          <>
            <View style={styles.floatingButtonContainer}>
              {/* Floating Menu Items */}
              {isFloatingMenuVisible && (
                <>
                  {/* Income Button */}
                  <Animated.View
                    style={[
                      styles.floatingMenuItem,
                      {
                        transform: [
                          {
                            translateX: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -80],
                            }),
                          },
                          {
                            translateY: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -70],
                            }),
                          },
                          {
                            scale: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }),
                          },
                        ],
                        opacity: animation,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.floatingButton, styles.incomeButton]}
                      onPress={handleIncomePress}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("@/assets/images/income.png")}
                        style={styles.floatingButtonImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Expense Button */}
                  <Animated.View
                    style={[
                      styles.floatingMenuItem,
                      {
                        transform: [
                          {
                            translateX: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 80],
                            }),
                          },
                          {
                            translateY: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -70],
                            }),
                          },
                          {
                            scale: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }),
                          },
                        ],
                        opacity: animation,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.floatingButton, styles.expenseButton]}
                      onPress={handleExpensePress}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("@/assets/images/expense.png")}
                        style={styles.floatingButtonImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </>
              )}

              {/* Main Add Button */}
              <View style={styles.btnCircleUp}>
                <TouchableOpacity
                  style={[
                    styles.btnCircle,
                    isFloatingMenuVisible && styles.btnCircleRotated,
                  ]}
                  onPress={toggleFloatingMenu}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "45deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <AntDesign name="plus" size={24} color="#FFFFFF" />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </>
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
    </>
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
  bottomBar: {
    zIndex: 10,
  },
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  fullScreenBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 5,
  },
  backdrop: {
    position: "absolute",
    top: -1000, // Cover the entire screen above
    left: 0,
    right: 0,
    bottom: -100, // Extend below the bottom tab
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 5,
  },
  floatingButtonContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingMenuItem: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  floatingButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonImage: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  incomeButton: {
    backgroundColor: "#00D09C",
  },
  expenseButton: {
    backgroundColor: "#FD3C4A",
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
    zIndex: 15,
  },
  btnCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7F3DFF",
  },
  btnCircleRotated: {
    backgroundColor: "#6B2FD6",
  },
});
