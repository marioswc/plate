import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export function FilterButton({
  label,
  active = false,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && styles.buttonActive,
        pressed && globalStyles.btnPressed,
      ]}
    >
      <Text
        style={[styles.text, active && styles.textActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={active ? Colors.onPrimary : Colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  textActive: {
    color: Colors.onPrimary,
  },
});
