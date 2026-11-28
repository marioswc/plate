import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import { useExerciseDetail } from "@/hooks/exercises/useExerciseDetail";
import { useSavedExercise } from "@/hooks/exercises/useSavedExercise";
import { useAuth } from "@/provider/AuthProvider";
import { getExerciseImageUrl } from "@/services/exercises/ExerciseService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { exercise, loading, error } = useExerciseDetail(id);
  const { saved, saving, toggleSave } = useSavedExercise(
    session?.user.id,
    exercise,
  );
  const { width } = useWindowDimensions();
  const [activeImage, setActiveImage] = useState(0);

  const imageCardWidth = width - Spacing.lg * 2;

  if (loading) {
    return (
      <View style={[globalStyles.screen, globalStyles.center]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={[globalStyles.screenPadded, globalStyles.center]}>
        <Text style={globalStyles.bodyError}>
          {error ?? "Exercise not found."}
        </Text>
      </View>
    );
  }

  const badges = [
    exercise.level,
    exercise.force,
    exercise.mechanic,
    exercise.category,
  ].filter(Boolean) as string[];

  const imageUrls = [
    getExerciseImageUrl(exercise.id, 0),
    getExerciseImageUrl(exercise.id, 1),
  ];

  const handleImageScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / imageCardWidth);
    setActiveImage(index);
  };

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Carrusel de fotos completas (sin recortar) */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleImageScroll}
          style={[styles.carousel, { width: imageCardWidth }]}
        >
          {imageUrls.map((url) => (
            <View
              key={url}
              style={[styles.imageFrame, { width: imageCardWidth }]}
            >
              <Image
                source={{ uri: url }}
                style={styles.image}
                contentFit="contain"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {imageUrls.map((url, index) => (
            <View
              key={url}
              style={[styles.dot, activeImage === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      {/* Nombre, botón guardar y etiquetas */}
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={[globalStyles.h2, styles.title]}>{exercise.name}</Text>

          <Pressable
            onPress={toggleSave}
            disabled={saving}
            hitSlop={8}
            style={({ pressed }) => [
              styles.saveButton,
              saved && styles.saveButtonActive,
              pressed && globalStyles.btnPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color={saved ? Colors.onPrimary : Colors.text}
              />
            ) : (
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={18}
                color={saved ? Colors.onPrimary : Colors.text}
              />
            )}
            <Text
              style={[
                styles.saveButtonText,
                saved && styles.saveButtonTextActive,
              ]}
            >
              {saved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        </View>

        {badges.length > 0 ? (
          <View style={styles.badgesRow}>
            {badges.map((badge) => (
              <View key={badge} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Detalles: equipamiento y músculos */}
      <View style={[globalStyles.card, styles.infoCard]}>
        {exercise.equipment ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Equipment</Text>
            <Text style={styles.infoValue}>{exercise.equipment}</Text>
          </View>
        ) : null}

        {exercise.primaryMuscles.length > 0 ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary muscles</Text>
            <Text style={styles.infoValue}>
              {exercise.primaryMuscles.join(", ")}
            </Text>
          </View>
        ) : null}

        {exercise.secondaryMuscles.length > 0 ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Secondary muscles</Text>
            <Text style={styles.infoValue}>
              {exercise.secondaryMuscles.join(", ")}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Instrucciones paso a paso */}
      {exercise.instructions.length > 0 ? (
        <View style={styles.section}>
          <Text style={globalStyles.h3}>Instructions</Text>

          <View style={[globalStyles.card, styles.instructionsCard]}>
            {exercise.instructions.map((step, index) => (
              <View key={index}>
                {index > 0 ? (
                  <View style={[globalStyles.divider, styles.stepDivider]} />
                ) : null}

                <View style={styles.stepItem}>
                  <Text style={styles.stepTitle}>Step {index + 1}</Text>
                  <Text style={styles.stepText}>{step.trim()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  carouselWrapper: {
    gap: Spacing.sm,
  },
  carousel: {
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  imageFrame: {
    height: 240,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  section: {
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  title: {
    flex: 1,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    marginTop: 2,
  },
  saveButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  saveButtonTextActive: {
    color: Colors.onPrimary,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  infoCard: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    textTransform: "capitalize",
  },
  instructionsCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  stepDivider: {
    marginVertical: Spacing.md,
  },
  stepItem: {
    gap: Spacing.xs,
  },
  stepTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  stepText: {
    fontSize: FontSize.sm,
    lineHeight: 21,
    color: Colors.text,
  },
});
