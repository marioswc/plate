import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ExerciseCardProps {
  name: string;
  muscle: string;
  level?: string | null;
  force?: string | null;
  imageUrl?: string | null;
  onPress?: () => void;
}

export function ExerciseCard({
  name,
  muscle,
  level,
  force,
  imageUrl,
  onPress,
}: ExerciseCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && globalStyles.btnPressed]}
    >
      <View style={styles.thumbnail}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.thumbnailImage}
            contentFit="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons
            name="barbell-outline"
            size={22}
            color={Colors.textSecondary}
          />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.muscle} numberOfLines={1}>
          {muscle}
        </Text>

        <View style={styles.badgesRow}>
          {level ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{level}</Text>
            </View>
          ) : null}
          {force ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{force}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceInput,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  muscle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  badgesRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textTransform: "capitalize",
  },
});
