import HeaderApp from "@/components/HeaderApp";
import TransactionItem from "@/components/TransactionItem";
import React from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

const DATA = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        type: "Shopping",
        description: "Buy some grocery",
        amount: -120,
        time: "10:00 AM",
        icon: "shoppingcart",
        color: "#FDC65C",
      },
      {
        id: "2",
        type: "Subscription",
        description: "Disney+ Annual..",
        amount: -80,
        time: "03:30 PM",
        icon: "profile",
        color: "#D6B2FF",
      },
      {
        id: "3",
        type: "Food",
        description: "Buy a ramen",
        amount: -32,
        time: "07:30 PM",
        icon: "rest",
        color: "#FFB1B1",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "4",
        type: "Salary",
        description: "Salary for July",
        amount: 5000,
        time: "04:30 PM",
        icon: "creditcard",
        color: "#B7F4C3",
      },
      {
        id: "5",
        type: "Transportation",
        description: "Charging Tesla",
        amount: -18,
        time: "08:30 PM",
        icon: "car",
        color: "#B6D9FF",
      },
    ],
  },
];

export default function TransactionScreen() {
  const _renderItem = ({ item }: any) => {
    return (
      <TransactionItem
        id={item.id}
        type={item.type}
        description={item.description}
        amount={item.amount}
        time={item.time}
        icon={item.icon}
        color={item.color}
      />
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <HeaderApp title={"Transactions"} />

      <SectionList
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
});
