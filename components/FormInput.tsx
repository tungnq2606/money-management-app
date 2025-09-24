import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export interface FormInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  errorMessage?: string;
  containerStyle?: object;
}

export default function FormInput({
  label,
  errorMessage,
  containerStyle,
  ...inputProps
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...inputProps}
        style={[
          styles.input,
          inputProps.editable === false && styles.inputDisabled,
        ]}
        placeholderTextColor="#8f8e8eff"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
  },
});
