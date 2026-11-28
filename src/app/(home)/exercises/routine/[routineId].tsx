import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Colors, globalStyles, Radius, Spacing } from "@/constant/theme";
import { useAuth } from "@/provider/AuthProvider";
import {
  deleteRoutine,
  getRoutineById,
  Routine,
} from "@/services/exercises/RoutineService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RoutineDetailScreen() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const { session } = useAuth();
  const userUid = session?.user.id;

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoutine = useCallback(async () => {
    if (!userUid || !routineId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const result = await getRoutineById(userUid, routineId);
    if (result.ok) {
      setRoutine(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [userUid, routineId]);

  useFocusEffect(
    useCallback(() => {
      loadRoutine();
    }, [loadRoutine]),
  );

  const handleEdit = () => {
    if (!routineId) return;
    router.push({
      pathname: "/exercises/create",
      params: { routineId },
    } as Href);
  };

  const handleDelete = () => {
    if (!userUid || !routineId || deleting) return;

    Alert.alert(
      "Delete routine",
      "Are you sure you want to delete this routine?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            const result = await deleteRoutine(userUid, routineId);
            setDeleting(false);
            if (result.ok) {
              router.back();
            } else {
              Alert.alert("Error", result.error);
            }
          },
        },
      ],
    );
  };

  if (loading && !routine) {
    return (
      <View style={[globalStyles.screen, globalStyles.center]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (error || !routine) {
    return (
      <View style={[globalStyles.screenPadded, globalStyles.center]}>
        <Text style={globalStyles.bodyError}>
          {error ?? "Routine not found."}
        </Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <View style={styles.headerRow}>
        <View style={styles.headerInfo}>
          <Text style={globalStyles.h2}>{routine.name}</Text>
          <Text style={globalStyles.bodyMuted}>
            {routine.exercises.length}{" "}
            {routine.exercises.length === 1 ? "exercise" : "exercises"}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={handleEdit}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && globalStyles.btnPressed,
            ]}
          >
            <Ionicons name="create-outline" size={18} color={Colors.text} />
          </Pressable>

          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && globalStyles.btnPressed,
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExerciseCard
            name={item.exercise_name}
            muscle={item.exercise_muscle_group}
            imageUrl={item.exercise_image}
            onPress={() =>
              router.push({
                pathname: "/exercises/[id]",
                params: { id: item.exercise_id },
              } as Href)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
});
