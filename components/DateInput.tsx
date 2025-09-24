import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface DateInputProps {
  label?: string;
  value?: Date | string | null;
  onChange?: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  textStyle?: TextStyle;
  mode?: "date" | "time" | "datetime";
}

function toDate(value?: Date | string | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function DateInput({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  placeholder = "Select date",
  containerStyle,
  inputStyle,
  textStyle,
  mode = "date",
}: DateInputProps) {
  const [visible, setVisible] = useState(false);

  const dateValue = useMemo(() => toDate(value) ?? new Date(), [value]);

  const displayText = useMemo(() => {
    const d = toDate(value);
    if (!d) return placeholder;
    if (mode === "time") {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (mode === "datetime") {
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return d.toLocaleDateString();
  }, [value, placeholder, mode]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.input, inputStyle]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[!toDate(value) ? styles.placeholder : styles.text, textStyle]}
        >
          {" "}
          {displayText}{" "}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={visible}
        mode={mode}
        date={dateValue}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(d) => {
          onChange?.(d);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#111",
  },
  placeholder: {
    fontSize: 16,
    color: "#8f8e8eff",
  },
});
