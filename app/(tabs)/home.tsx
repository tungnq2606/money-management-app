import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const data_transaction = [
  {
    id: "1",
    type: "income",
    note: "Lương tháng 13",
    name: "Lương",
    amount: 5000000,
  },
  {
    id: "2",
    type: "expense",
    note: "Mua quần áo",
    name: "Mua sắm",
    amount: 2000000,
  },
  {
    id: "3",
    type: "income",
    note: "làm job ở mô mô",
    name: "Làm thêm",
    amount: 3000000,
  },
  {
    id: "4",
    type: "expense",
    note: "mua gì mua lăm",
    name: "Mua sắm",
    amount: 1000000,
  },
];

const incomeData = [
  { value: 2000000, label: "15 APR", customData: data_transaction[2] }, // job làm thêm
  { value: 0 },
  { value: 3000000, customData: data_transaction[0] }, // lương tháng 13
  { value: 0 },
  { value: 5000000, customData: data_transaction[0] },
  { value: 0 },
  { value: 0, label: "21 APR" },
];

const expenseData = [
  { value: 0, label: "15 APR" },
  { value: 2000000, customData: data_transaction[1] }, // mua quần áo
  { value: 0 },
  { value: 1000000, customData: data_transaction[3] }, // mua sắm
  { value: 0 },
  { value: 0 },
  { value: 0, label: "21 APR" },
];

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];
const { width } = Dimensions.get("window");
const Home = () => {
  const [selected, setSelected] = useState(null);
  return (
    <View style={styles.container}>
      <FlatList
        data={data_transaction}
        ListHeaderComponent={
          <>
            <SafeAreaView style={styles.header}>
              <View style={styles.headerAccount}>
                <Image
                  source={require("../../assets/images/favicon.png")}
                  style={styles.logo}
                />
                <Text>Hello Đăng</Text>
                <Ionicons name="notifications" size={24} color="black" />
              </View>
              <Text style={styles.balanceText}>Số dư</Text>
              <Text style={styles.moneyText}>20,000,000 đ</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                  paddingHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "green",
                    borderRadius: 28,
                    padding: 16,
                    width: "48%",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 8,
                      padding: 8,
                      width: 48,
                      height: 48,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="trending-up" size={24} color="green" />
                  </View>
                  <View>
                    <Text style={{ color: "white" }}>Thu nhập</Text>
                    <Text style={{ color: "white" }}>+ 5,000,000 đ</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "red",
                    borderRadius: 28,
                    padding: 16,
                    width: "48%",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 8,
                      padding: 8,
                      width: 48,
                      height: 48,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="trending-down" size={24} color="red" />
                  </View>
                  <View>
                    <Text style={{ color: "white" }}>Chi tiêu</Text>
                    <Text style={{ color: "white" }}>- 5,000,000 đ</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
            <View style={{ padding: 16 }}>
              <LineChart
                areaChart
                curved
                data={incomeData}
                data2={expenseData}
                startFillColor="rgba(61, 153, 252, 0.3)"
                startFillColor2="rgba(255, 110, 141, 0.3)"
                endFillColor="rgba(171, 212, 255, 0.05)"
                endFillColor2="rgba(255, 181, 197, 0.05)"
                color1="blue"
                color2="red"
                dataPointsColor1="blue"
                dataPointsColor2="red"
                showVerticalLines
                spacing={40}
                yAxisTextStyle={{ color: "#555" }}
                xAxisColor="#ccc"
                yAxisColor="#ccc"
                hideDataPoints={false}
                width={width - 32}
                onPress={(point: any) => {
                  if (point?.customData) {
                    setSelected(point.customData);
                    Alert.alert(
                      point.customData.type === "income"
                        ? "Thu nhập"
                        : "Chi tiêu",
                      `${point.customData.name} - ${
                        point.customData.note
                      }\nSố tiền: ${point.customData.amount.toLocaleString()} VND`
                    );
                  }
                }}
              />
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 16,
              }}
            >
              <Text>Giao dịch gần đây</Text>
              <TouchableOpacity>
                <Text>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 4, backgroundColor: "#fcf8eeff" }} />
          </>
        }
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
                <Text>{item.name}</Text>
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
                <Text>10:00 AM</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 30,
    resizeMode: "contain",
  },
  header: {
    backgroundColor: "#fcf8eeff",
  },
  headerAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  balanceText: {
    fontSize: 16,
    textAlign: "center",
  },
  moneyText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
