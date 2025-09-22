import React from 'react';
import {SectionList, View, Text, StyleSheet} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import HeaderApp from "@/components/HeaderApp";

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
  const _renderItem = ({item}: any) => {
    const isIncome = item.amount > 0;

    return (
      <View style={styles.item}>
        <View style={[styles.iconWrapper, {backgroundColor: item.color}]}>
          <AntDesign name={item.icon} size={20} color="#000"/>
        </View>

        <View style={styles.detail}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
            {isIncome ? `+ $${item.amount}` : `- $${Math.abs(item.amount)}`}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({section: {title}}: any) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <HeaderApp title={'Transactions'}/>

      <SectionList
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{padding: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detail: {
    flex: 1,
  },
  type: {
    fontWeight: '600',
    fontSize: 16,
  },
  desc: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  income: {
    color: 'green',
  },
  expense: {
    color: 'red',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
