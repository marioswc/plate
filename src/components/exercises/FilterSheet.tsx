import { FilterOption } from "@/constant/exerciseFilters";
import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface FilterSheetProps {
  visible: boolean;
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function FilterSheet({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <View style={globalStyles.divider} />

          <View style={styles.grid}>
            {options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  style={({ pressed }) => [
                    styles.card,
                    isSelected && styles.cardSelected,
                    pressed && globalStyles.btnPressed,
                  ]}
                >
                  <Text style={styles.label} numberOfLines={1}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl + Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  card: {
    width: "31%",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
});
