import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const data_section_transaction = [
  {
    id: 1,
    title: "Giao dịch 1",
    amount: 100000,
    date: "2023-01-01",
    data: [
      {
        id: 1,
        title: "Chi tiêu 1",
        amount: 50000,
        type: "expense",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 2,
        title: "Chi tiêu 2",
        amount: 30000,
        type: "income",
        date: "2023-01-01",
        note: "Mua sắm",
      },
    ],
  },
  {
    id: 2,
    title: "Giao dịch 2",
    amount: 200000,
    date: "2023-01-02",
    data: [
      {
        id: 1,
        title: "Chi tiêu 1",
        amount: 50000,
        type: "expense",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 2,
        title: "Chi tiêu 2",
        amount: 30000,
        type: "income",
        date: "2023-01-01",
        note: "Mua sắm",
      },
    ],
  },
  {
    id: 3,
    title: "Giao dịch 3",
    amount: 300000,
    date: "2023-01-03",
    data: [
      {
        id: 1,
        title: "Chi tiêu 1",
        amount: 50000,
        type: "expense",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 2,
        title: "Chi tiêu 2",
        amount: 30000,
        type: "income",
        date: "2023-01-01",
        note: "Mua sắm",
      },
    ],
  },
  {
    id: 4,
    title: "Giao dịch 4",
    amount: 400000,
    date: "2023-01-04",
    data: [
      {
        id: 1,
        title: "Chi tiêu 1",
        amount: 50000,
        type: "expense",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 2,
        title: "Chi tiêu 2",
        amount: 30000,
        type: "income",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 3,
        title: "Chi tiêu 1",
        amount: 50000,
        type: "expense",
        date: "2023-01-01",
        note: "Mua sắm",
      },
      {
        id: 4,
        title: "Chi tiêu 2",
        amount: 30000,
        type: "income",
        date: "2023-01-01",
        note: "Mua sắm",
      },
    ],
  },
];

const Transaction = () => {
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginVertical: 16,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign name="down" size={14} color="black" />
          <Text>Ngày</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => setModalFilterVisible(true)}
        >
          <Ionicons name="filter-outline" size={14} color="black" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={data_section_transaction}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              padding: 16,
              width: "100%",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffdb80ff",
                padding: 8,
                height: 48,
                width: 48,
                borderRadius: 8,
              }}
            ></View>
            <View
              style={{
                width: "90%",
                paddingHorizontal: 8,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{item.title}</Text>
                <Text
                  style={{ color: item.type === "expense" ? "red" : "green" }}
                >
                  {item.type === "expense" ? "-" : "+"} {item.amount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{item.note}</Text>
                <Text>{item.date}</Text>
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title, amount, date } }) => (
          <View style={{ backgroundColor: "white" }}>
            <Text>{date}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
      />

      <Modal
        visible={modalFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalFilterVisible(!modalFilterVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text>Bộ lọc</Text>
              <TouchableOpacity onPress={() => setModalFilterVisible(false)}>
                <AntDesign name="closecircleo" size={18} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontWeight: "bold", marginTop: 16 }}>Lọc theo</Text>
            <View style={{ flexDirection: "row", marginTop: 8, gap: 16 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 30,
                  borderColor: "gray",
                }}
              >
                <Text>Thu nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 30,
                  borderColor: "gray",
                }}
              >
                <Text>Thu chi</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: "bold", marginTop: 16 }}>
              Sắp xếp theo
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 8,
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {data_sort.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={{
                    borderWidth: 1,
                    padding: 8,
                    borderRadius: 30,
                    borderColor: "gray",
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.btnApply}
              onPress={() => setModalFilterVisible(false)}
            >
              <Text>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
  },
  modalView: {
    minHeight: 350,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
  },
  btnApply: {
    backgroundColor: "#ffdb80ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

const data_sort = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
  { label: "Số tiền tăng dần", value: "amount_asc" },
  { label: "Số tiền giảm dần", value: "amount_desc" },
];
