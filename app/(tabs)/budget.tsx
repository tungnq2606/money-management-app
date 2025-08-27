import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Budget = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget</Text>
      </View>
      <View style={{ flex: 4 }}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={({ item }) => <Text>name</Text>}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "lightblue",
            borderRadius: 8,
            zIndex: 100,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text>Add Budget</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Budget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});
