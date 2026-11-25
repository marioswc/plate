import {
  Colors,
  FontSize,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";

type FormInputProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCount?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  style?: StyleProp<TextStyle>;
};

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  error,
  multiline = false,
  numberOfLines = 4,
  maxLength,
  showCount = false,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
  style,
}: FormInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <View style={globalStyles.rowBetween}>
          <Text style={globalStyles.label}>{label}</Text>
          {showCount && maxLength ? (
            <Text style={globalStyles.caption}>
              {value.length}/{maxLength}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
        ]}
      >
        {icon && !multiline ? (
          <Ionicons name={icon} style={globalStyles.inputIcon} />
        ) : null}

        <TextInput
          style={[
            globalStyles.inputText,
            multiline && styles.multilineText,
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>

      {error ? <Text style={globalStyles.bodyError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  multilineContainer: {
    alignItems: "flex-start",
    minHeight: 112,
    paddingVertical: Spacing.md,
  },
  multilineText: {
    fontSize: FontSize.md,
    minHeight: 84,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  inputDisabled: {
    opacity: 0.6,
  },
});
