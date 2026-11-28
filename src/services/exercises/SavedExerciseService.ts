import { supabase } from "@/lib/supabase";

export interface SavedExercise {
  save_id: string;
  user_uid: string;
  created_at: string;
  exercise_id: string;
  exercise_name: string;
  exercise_muscle_group: string;
  exercise_image: string | null;
}

export interface SaveExerciseInput {
  exercise_id: string;
  exercise_name: string;
  exercise_muscle_group: string;
  exercise_image: string | null;
}

export async function isExerciseSaved(
  userUid: string,
  exerciseId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_saved_exercises")
    .select("save_id")
    .eq("user_uid", userUid)
    .eq("exercise_id", exerciseId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return data !== null;
}

export async function saveExercise(
  userUid: string,
  input: SaveExerciseInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const alreadySaved = await isExerciseSaved(userUid, input.exercise_id);
  if (alreadySaved) {
    return { ok: true };
  }

  const { error } = await supabase.from("user_saved_exercises").insert({
    user_uid: userUid,
    exercise_id: input.exercise_id,
    exercise_name: input.exercise_name,
    exercise_muscle_group: input.exercise_muscle_group,
    exercise_image: input.exercise_image,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function unsaveExercise(
  userUid: string,
  exerciseId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase
    .from("user_saved_exercises")
    .delete()
    .eq("user_uid", userUid)
    .eq("exercise_id", exerciseId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getSavedExercises(
  userUid: string,
): Promise<{ ok: true; data: SavedExercise[] } | { ok: false; error: string }> {
  const { data, error } = await supabase
    .from("user_saved_exercises")
    .select(
      "save_id, user_uid, created_at, exercise_id, exercise_name, exercise_muscle_group, exercise_image",
    )
    .eq("user_uid", userUid)
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data ?? [] };
}
