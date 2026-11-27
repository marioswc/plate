import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { FilterButton } from "@/components/exercises/FilterButton";
import { FilterSheet } from "@/components/exercises/FilterSheet";
import {
  FilterType,
  FORCE_OPTIONS,
  getFilterLabel,
  LEVEL_OPTIONS,
  MUSCLE_OPTIONS,
} from "@/constant/exerciseFilters";
import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Spacing,
} from "@/constant/theme";
import { useExercises } from "@/hooks/exercises/useExercises";
import { getExerciseImageUrl } from "@/services/exercises/ExerciseService";
import { Href, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ExploreRoutinesScreen() {
  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedForce, setSelectedForce] = useState<string | null>(null);

  const { exercises, loading, loadingMore, hasMore, error, loadMore } =
    useExercises({
      level: selectedLevel,
      primaryMuscles: selectedMuscle,
      force: selectedForce,
    });

  const modalConfig = {
    level: { title: "Level", options: LEVEL_OPTIONS, value: selectedLevel },
    primaryMuscles: {
      title: "Muscle",
      options: MUSCLE_OPTIONS,
      value: selectedMuscle,
    },
    force: { title: "Force", options: FORCE_OPTIONS, value: selectedForce },
  };

  const currentModal = openFilter ? modalConfig[openFilter] : null;

  const handleSelectOption = (value: string) => {
    if (openFilter === "level") {
      setSelectedLevel(selectedLevel === value ? null : value);
    } else if (openFilter === "primaryMuscles") {
      setSelectedMuscle(selectedMuscle === value ? null : value);
    } else if (openFilter === "force") {
      setSelectedForce(selectedForce === value ? null : value);
    }
    setOpenFilter(null);
  };

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <Text style={styles.sectionTitle}>Exercises</Text>

      <View style={styles.filtersRow}>
        <FilterButton
          label={getFilterLabel(LEVEL_OPTIONS, selectedLevel, "Level")}
          active={selectedLevel !== null}
          onPress={() => setOpenFilter("level")}
        />
        <FilterButton
          label={getFilterLabel(MUSCLE_OPTIONS, selectedMuscle, "Muscle")}
          active={selectedMuscle !== null}
          onPress={() => setOpenFilter("primaryMuscles")}
        />
        <FilterButton
          label={getFilterLabel(FORCE_OPTIONS, selectedForce, "Force")}
          active={selectedForce !== null}
          onPress={() => setOpenFilter("force")}
        />
      </View>

      {loading ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <Text style={globalStyles.bodyError}>{error}</Text>
        </View>
      ) : exercises.length === 0 ? (
        <View style={[globalStyles.flex1, globalStyles.center]}>
          <Text style={globalStyles.bodyMuted}>No exercises found</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ExerciseCard
              name={item.name}
              muscle={item.primaryMuscles?.[0] ?? "General"}
              level={item.level}
              force={item.force}
              imageUrl={item.id ? getExerciseImageUrl(item.id) : null}
              onPress={() =>
                router.push({
                  pathname: "/exercises/[id]",
                  params: { id: item.id },
                } as Href)
              }
            />
          )}
          ListFooterComponent={
            hasMore ? (
              <Pressable
                onPress={loadMore}
                disabled={loadingMore}
                style={({ pressed }) => [
                  globalStyles.secondaryButton,
                  styles.loadMoreButton,
                  pressed && globalStyles.btnPressed,
                ]}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={globalStyles.secondaryButtonText}>
                    Load more
                  </Text>
                )}
              </Pressable>
            ) : undefined
          }
        />
      )}

      <FilterSheet
        visible={currentModal !== null}
        title={currentModal?.title ?? ""}
        options={currentModal?.options ?? []}
        selectedValue={currentModal?.value ?? null}
        onSelect={handleSelectOption}
        onClose={() => setOpenFilter(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filtersRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  loadMoreButton: {
    marginTop: Spacing.sm,
  },
});
