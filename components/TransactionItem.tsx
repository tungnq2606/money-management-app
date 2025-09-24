import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatMoney } from "@/constants/formatMoney";

interface TransactionItemProps {
  id: string;
  type: string;
  description: string;
  amount: number;
  time: string;
  icon: string;
  color: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  description,
  amount,
  time,
  icon,
  color,
}) => {
  const isIncome = amount > 0;

  return (
    <View style={styles.item}>
      <View style={[styles.iconWrapper, { backgroundColor: color }]}>
        <AntDesign name={icon as any} size={20} color="#000" />
      </View>

      <View style={styles.detail}>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      <View style={styles.meta}>
        <Text
          style={[styles.amount, isIncome ? styles.income : styles.expense]}
        >
          {isIncome
            ? `+ ${formatMoney(amount)}`
            : `- ${formatMoney(Math.abs(amount))}`}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detail: {
    flex: 1,
  },
  type: {
    fontWeight: "600",
    fontSize: 16,
  },
  desc: {
    color: "#999",
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
});

export default TransactionItem;
