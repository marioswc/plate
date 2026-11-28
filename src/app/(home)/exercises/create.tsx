import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import { useAuth } from "@/provider/AuthProvider";
import {
  createRoutine,
  getRoutineById,
  ROUTINE_NAME_MAX_LENGTH,
  RoutineExerciseInput,
  updateRoutine,
} from "@/services/exercises/RoutineService";
import { getSavedExercises } from "@/services/exercises/SavedExerciseService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Href, router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CreateRoutineScreen() {
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  const isEditing = Boolean(routineId);

  const { session } = useAuth();
  const userUid = session?.user.id;

  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExerciseInput[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userUid) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      const savedRes = await getSavedExercises(userUid!);
      let list: RoutineExerciseInput[] = savedRes.ok ? savedRes.data : [];

      if (routineId) {
        const routineRes = await getRoutineById(userUid!, routineId);
        if (routineRes.ok) {
          setName(routineRes.data.name);
          setSelectedIds(routineRes.data.exercises.map((ex) => ex.exercise_id));

          // Mantener visibles ejercicios que ya estaban en la rutina aunque ya no estén en favoritos
          const extraFromRoutine = routineRes.data.exercises.filter(
            (ex) => !list.some((item) => item.exercise_id === ex.exercise_id),
          );
          list = [...extraFromRoutine, ...list];
        } else {
          setError(routineRes.error);
        }
      } else if (!savedRes.ok) {
        setError(savedRes.error);
      }

      setExercises(list);
      setLoading(false);
    }

    loadData();
  }, [userUid, routineId]);

  const toggleExercise = (exerciseId: string) => {
    setError(null);
    setSelectedIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

  const handleSubmit = async () => {
    if (!userUid || saving) return;

    const selected = exercises.filter((item) =>
      selectedIds.includes(item.exercise_id),
    );

    setSaving(true);
    setError(null);
    Keyboard.dismiss();

    const result = routineId
      ? await updateRoutine(userUid, routineId, name, selected)
      : await createRoutine(userUid, name, selected);

    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.back();
  };

  const canSubmit = name.trim().length >= 2 && selectedIds.length > 0;

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <Stack.Screen
        options={{ title: isEditing ? "Edit routine" : "New routine" }}
      />

      <FormInput
        label="Routine name"
        placeholder="e.g. Push Day, Leg Day..."
        value={name}
        maxLength={ROUTINE_NAME_MAX_LENGTH}
        showCount
        autoCapitalize="words"
        editable={!saving}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved exercises</Text>
        <Text style={globalStyles.bodyMuted}>
          {selectedIds.length} selected
        </Text>
      </View>

      {loading ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : exercises.length === 0 ? (
        <View style={[globalStyles.flex1, globalStyles.center, styles.empty]}>
          <Text style={[globalStyles.bodyMuted, styles.emptyText]}>
            You have no saved exercises yet. Save exercises from Explore first.
          </Text>
          <Pressable
            onPress={() => router.push("/exercises/explore" as Href)}
            style={({ pressed }) => [
              globalStyles.secondaryButton,
              pressed && globalStyles.btnPressed,
            ]}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Explore exercises
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.exercise_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.exercise_id);
            return (
              <Pressable
                onPress={() => toggleExercise(item.exercise_id)}
                style={({ pressed }) => [
                  styles.itemCard,
                  isSelected && styles.itemCardSelected,
                  pressed && globalStyles.btnPressed,
                ]}
              >
                <View style={styles.thumbnail}>
                  {item.exercise_image ? (
                    <Image
                      source={{ uri: item.exercise_image }}
                      style={styles.thumbnailImage}
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons
                      name="barbell-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                  )}
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.exercise_name}
                  </Text>
                  <Text style={styles.itemMuscle} numberOfLines={1}>
                    {item.exercise_muscle_group}
                  </Text>
                </View>

                <Ionicons
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={isSelected ? Colors.primary : Colors.textMuted}
                />
              </Pressable>
            );
          }}
        />
      )}

      {error ? <Text style={globalStyles.bodyError}>{error}</Text> : null}

      <View style={styles.footer}>
        <PrimaryButton
          handlePress={handleSubmit}
          buttonText={isEditing ? "Save changes" : "Create routine"}
          loading={saving}
          disabled={!canSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  empty: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    textAlign: "center",
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  itemCardSelected: {
    borderColor: Colors.primary,
  },
  thumbnail: {
    width: 48,
    height: 48,
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
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  itemMuscle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  footer: {
    paddingTop: Spacing.xs,
  },
});
