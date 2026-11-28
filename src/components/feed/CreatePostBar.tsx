import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CreatePostBarProps {
  onCreatePost?: () => void;
  onAddPhoto?: () => void;
  onShareRoutine?: () => void;
}

export function CreatePostBar({
  onCreatePost,
  onAddPhoto,
  onShareRoutine,
}: CreatePostBarProps) {
  return (
    <View style={[globalStyles.card, styles.container]}>
      <Pressable
        onPress={onCreatePost}
        style={({ pressed }) => [
          styles.prompt,
          pressed && globalStyles.btnPressed,
        ]}
      >
        <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.promptText}>What did you train today?</Text>
      </Pressable>

      <View style={globalStyles.divider} />

      <View style={styles.actions}>
        <Pressable
          onPress={onAddPhoto}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="image-outline" size={18} color={Colors.text} />
          <Text style={styles.actionText}>Photo</Text>
        </Pressable>

        <Pressable
          onPress={onShareRoutine}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="barbell-outline" size={18} color={Colors.text} />
          <Text style={styles.actionText}>Routine</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  promptText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceInput,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
});
