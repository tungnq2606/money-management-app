import MonthSelector from "@/components/MonthSelector";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const HomeScreen = () => {
  const handleMonthChange = (monthIndex: number, monthName: string) => {
    console.log(`Selected month: ${monthName} (index: ${monthIndex})`);
    // Handle month change logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={24} color="white" />
          </View>

          <MonthSelector onMonthChange={handleMonthChange} />

          <Ionicons name="notifications" size={24} color="#7F3DFF" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
});
