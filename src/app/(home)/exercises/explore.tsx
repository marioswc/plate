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
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Datos de ejemplo solo para ver el diseño (luego vendrán del fetch)
const MOCK_EXERCISES = [
  {
    id: "1",
    name: "3/4 Sit-Up",
    muscle: "Abdominals",
    level: "Beginner",
    force: "Pull",
  },
  {
    id: "2",
    name: "Barbell Bench Press",
    muscle: "Chest",
    level: "Intermediate",
    force: "Push",
  },
  {
    id: "3",
    name: "Stiff-Legged Barbell Deadlift",
    muscle: "Hamstrings",
    level: "Expert",
    force: "Pull",
  },
];

export default function ExploreRoutinesScreen() {
  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedForce, setSelectedForce] = useState<string | null>(null);

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {MOCK_EXERCISES.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            name={exercise.name}
            muscle={exercise.muscle}
            level={exercise.level}
            force={exercise.force}
          />
        ))}
      </ScrollView>

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
});
