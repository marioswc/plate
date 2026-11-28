import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import { useRoutines } from "@/hooks/exercises/useRoutines";
import { useAuth } from "@/provider/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ExercisesScreen() {
  const { session } = useAuth();
  const { routines, loading, error, refetch } = useRoutines(session?.user.id);
  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const handleCreateRoutine = () => {
    router.push("/exercises/create" as Href);
  };

  const handleExploreRoutines = () => {
    router.push("/exercises/explore" as Href);
  };

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <Text style={globalStyles.h2}>Routines</Text>

      <View style={[globalStyles.row, styles.actionsRow]}>
        <Pressable
          onPress={handleCreateRoutine}
          style={({ pressed }) => [
            globalStyles.secondaryButton,
            globalStyles.flex1,
            styles.actionButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.text} />
          <Text style={globalStyles.secondaryButtonText}>New routine</Text>
        </Pressable>

        <Pressable
          onPress={handleExploreRoutines}
          style={({ pressed }) => [
            globalStyles.secondaryButton,
            globalStyles.flex1,
            styles.actionButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="search-outline" size={24} color={Colors.text} />
          <Text style={globalStyles.secondaryButtonText}>Explore routines</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>My routines</Text>

      {loading && routines.length === 0 ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : error && routines.length === 0 ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <Text style={globalStyles.bodyError}>{error}</Text>
        </View>
      ) : routines.length === 0 ? (
        <View style={[globalStyles.card, styles.emptyCard]}>
          <Ionicons
            name="albums-outline"
            size={28}
            color={Colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>No routines yet</Text>
          <Text style={[globalStyles.bodyMuted, styles.emptyText]}>
            Save exercises from Explore and tap New routine to create your first
            playlist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.routine_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const count = item.exercises.length;
            const preview = item.exercises
              .slice(0, 3)
              .map((ex) => ex.exercise_name)
              .join(", ");

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/exercises/routine/[routineId]",
                    params: { routineId: item.routine_id },
                  } as Href)
                }
                style={({ pressed }) => [
                  styles.routineCard,
                  pressed && globalStyles.btnPressed,
                ]}
              >
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.routineCount}>
                    {count} {count === 1 ? "exercise" : "exercises"}
                  </Text>
                  {preview ? (
                    <Text style={styles.routinePreview} numberOfLines={1}>
                      {preview}
                    </Text>
                  ) : null}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.textMuted}
                />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  actionsRow: {
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  emptyCard: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptyText: {
    textAlign: "center",
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  routineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  routineInfo: {
    flex: 1,
    gap: 4,
  },
  routineName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  routineCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  routinePreview: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
