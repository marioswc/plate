import {
  ExerciseDetail,
  getExerciseImageUrl,
} from "@/services/exercises/ExerciseService";
import {
  isExerciseSaved,
  saveExercise,
  unsaveExercise,
} from "@/services/exercises/SavedExerciseService";
import { useEffect, useState } from "react";

export function useSavedExercise(
  userUid?: string,
  exercise?: ExerciseDetail | null,
) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const exerciseId = exercise?.id;

  useEffect(() => {
    if (!userUid || !exerciseId) return;

    let active = true;

    async function checkSaved() {
      const result = await isExerciseSaved(userUid!, exerciseId!);
      if (active) {
        setSaved(result);
      }
    }

    checkSaved();

    return () => {
      active = false;
    };
  }, [userUid, exerciseId]);

  const toggleSave = async () => {
    if (!userUid || !exercise || saving) return;

    setSaving(true);

    if (saved) {
      const result = await unsaveExercise(userUid, exercise.id);
      if (result.ok) {
        setSaved(false);
      }
    } else {
      const result = await saveExercise(userUid, {
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_muscle_group: exercise.primaryMuscles[0] ?? "General",
        exercise_image: getExerciseImageUrl(exercise.id, 0),
      });
      if (result.ok) {
        setSaved(true);
      }
    }

    setSaving(false);
  };

  return { saved, saving, toggleSave };
}
