import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface SpendFrequencyChartProps {
  data?: { value: number }[];
  title?: string;
  selectedPeriod?: string;
  onChangePeriod?: (period: string) => void;
}

const SpendFrequencyChart: React.FC<SpendFrequencyChartProps> = ({
  data = [],
  title = "Spend Frequency",
  selectedPeriod: controlledSelectedPeriod,
  onChangePeriod,
}) => {
  console.log(data);
  const { width } = useWindowDimensions();
  const [uncontrolledSelectedPeriod, setUncontrolledSelectedPeriod] =
    useState("Today");

  const periods = ["Today", "Week", "Month", "Year"];

  const selectedPeriod = controlledSelectedPeriod ?? uncontrolledSelectedPeriod;

  const handlePeriodPress = (period: string) => {
    if (onChangePeriod) {
      onChangePeriod(period);
    } else {
      setUncontrolledSelectedPeriod(period);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={data}
          width={width}
          height={200}
          color="#8B50FF"
          thickness={3}
          hideDataPoints={true}
          isAnimated={true}
          animationDuration={1000}
          hideAxesAndRules={true}
          backgroundColor="transparent"
          startFillColor="#8B50FF"
          endFillColor="#8B50FF40"
          startOpacity={0.25}
          endOpacity={0}
          areaChart={true}
          curved={true}
          hideYAxisText={true}
          hideOrigin={true}
          yAxisColor="transparent"
          xAxisColor="transparent"
          disableScroll
          initialSpacing={0}
        />
      </View>
      <View style={styles.buttonContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedButton,
            ]}
            onPress={() => handlePeriodPress(period)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === period && styles.selectedButtonText,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 12,
  },
  chartWrapper: {
    alignItems: "center",
    marginHorizontal: -12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    minWidth: 60,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "rgba(252, 172, 18, 0.2)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedButtonText: {
    color: "#FCAC12",
  },
});

export default SpendFrequencyChart;
