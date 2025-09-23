import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MonthSelectorProps {
  onMonthChange?: (monthIndex: number, monthName: string) => void;
  initialMonth?: number;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  onMonthChange,
  initialMonth = new Date().getMonth(),
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);

  // Memoize months array to prevent recreation on every render
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  // Memoize close handler to prevent recreation
  const handleModalClose = useCallback(() => {
    setIsMonthModalVisible(false);
  }, []);

  // Memoize month selection handler
  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      setSelectedMonth(monthIndex);
      setIsMonthModalVisible(false);
      onMonthChange?.(monthIndex, months[monthIndex]);
    },
    [onMonthChange, months]
  );

  // Memoize render function for better FlatList performance
  const renderMonthItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity
        style={[
          styles.monthItem,
          selectedMonth === index && styles.selectedMonthItem,
        ]}
        onPress={() => handleMonthSelect(index)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.monthText,
            selectedMonth === index && styles.selectedMonthText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [selectedMonth, handleMonthSelect]
  );

  // Memoize keyExtractor for FlatList optimization
  const keyExtractor = useCallback(
    (item: string, index: number) => `month-${index}`,
    []
  );

  return (
    <>
      <TouchableOpacity
        style={styles.monthSelector}
        onPress={() => setIsMonthModalVisible(true)}
      >
        <Text style={styles.monthSelectorText}>{months[selectedMonth]}</Text>
        <AntDesign name="down" size={16} color="#7F3DFF" />
      </TouchableOpacity>

      <Modal
        visible={isMonthModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Month</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleModalClose}
                    activeOpacity={0.7}
                  >
                    <AntDesign name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={months}
                  renderItem={renderMonthItem}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  style={styles.monthList}
                  getItemLayout={(data, index) => ({
                    length: 58, // Updated height: paddingVertical: 15 * 2 + fontSize: 16 + marginVertical: 4 * 2
                    offset: 58 * index,
                    index,
                  })}
                  initialScrollIndex={selectedMonth > 3 ? selectedMonth - 3 : 0}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={6}
                  updateCellsBatchingPeriod={50}
                  windowSize={10}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  monthList: {
    maxHeight: 400,
    flexGrow: 0,
  },
  monthItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  selectedMonthItem: {
    backgroundColor: "#7F3DFF",
    borderColor: "#6B2FD6",
    shadowColor: "#7F3DFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  selectedMonthText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default MonthSelector;
