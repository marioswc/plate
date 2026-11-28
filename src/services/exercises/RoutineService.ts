import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ROUTINE_NAME_MAX_LENGTH = 40;

export interface RoutineExerciseInput {
  exercise_id: string;
  exercise_name: string;
  exercise_muscle_group: string;
  exercise_image: string | null;
}

export interface RoutineExercise extends RoutineExerciseInput {
  id: string;
  routine_id: string;
  user_uid: string;
  created_at: string;
}

export interface Routine {
  routine_id: string;
  user_uid: string;
  name: string;
  created_at: string;
  exercises: RoutineExercise[];
}

function validateRoutine(name: string, exerciseCount: number): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Routine name is required.";
  }
  if (trimmed.length < 2) {
    return "Routine name must be at least 2 characters.";
  }
  if (trimmed.length > ROUTINE_NAME_MAX_LENGTH) {
    return `Routine name must be ${ROUTINE_NAME_MAX_LENGTH} characters or less.`;
  }
  if (exerciseCount === 0) {
    return "Select at least one exercise.";
  }
  return null;
}

function getCacheKey(userUid: string) {
  return `plate_routines_${userUid}`;
}

async function saveRoutinesToCache(userUid: string, routines: Routine[]) {
  try {
    await AsyncStorage.setItem(getCacheKey(userUid), JSON.stringify(routines));
  } catch {
    // Si falla el caché local no bloqueamos la app
  }
}

async function getRoutinesFromCache(userUid: string): Promise<Routine[] | null> {
  try {
    const raw = await AsyncStorage.getItem(getCacheKey(userUid));
    return raw ? (JSON.parse(raw) as Routine[]) : null;
  } catch {
    return null;
  }
}

export async function getRoutines(
  userUid: string,
): Promise<{ ok: true; data: Routine[] } | { ok: false; error: string }> {
  try {
    const [routinesRes, exercisesRes] = await Promise.all([
      supabase
        .from("routines")
        .select("routine_id, user_uid, name, created_at")
        .eq("user_uid", userUid)
        .order("created_at", { ascending: false }),
      supabase
        .from("routine_exercises")
        .select(
          "id, routine_id, user_uid, exercise_id, exercise_name, exercise_muscle_group, exercise_image, created_at",
        )
        .eq("user_uid", userUid)
        .order("created_at", { ascending: true }),
    ]);

    if (routinesRes.error || exercisesRes.error) {
      const cached = await getRoutinesFromCache(userUid);
      if (cached) {
        return { ok: true, data: cached };
      }

      return {
        ok: false,
        error:
          routinesRes.error?.message ??
          exercisesRes.error?.message ??
          "Could not load routines.",
      };
    }

    const allExercises = exercisesRes.data ?? [];
    const routines: Routine[] = (routinesRes.data ?? []).map((routine) => ({
      ...routine,
      exercises: allExercises.filter(
        (item) => item.routine_id === routine.routine_id,
      ),
    }));

    await saveRoutinesToCache(userUid, routines);
    return { ok: true, data: routines };
  } catch {
    const cached = await getRoutinesFromCache(userUid);
    if (cached) {
      return { ok: true, data: cached };
    }

    return {
      ok: false,
      error: "Network error. Could not load routines.",
    };
  }
}

export async function getRoutineById(
  userUid: string,
  routineId: string,
): Promise<{ ok: true; data: Routine } | { ok: false; error: string }> {
  const result = await getRoutines(userUid);
  if (!result.ok) {
    return result;
  }

  const found = result.data.find((item) => item.routine_id === routineId);
  if (!found) {
    return { ok: false, error: "Routine not found." };
  }

  return { ok: true, data: found };
}

export async function createRoutine(
  userUid: string,
  name: string,
  selectedExercises: RoutineExerciseInput[],
): Promise<{ ok: true; routineId: string } | { ok: false; error: string }> {
  const validationError = validateRoutine(name, selectedExercises.length);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const { data: routine, error: routineError } = await supabase
    .from("routines")
    .insert({
      user_uid: userUid,
      name: name.trim(),
    })
    .select("routine_id")
    .single();

  if (routineError || !routine) {
    return {
      ok: false,
      error: routineError?.message ?? "Could not create routine.",
    };
  }

  const rows = selectedExercises.map((exercise) => ({
    routine_id: routine.routine_id,
    user_uid: userUid,
    exercise_id: exercise.exercise_id,
    exercise_name: exercise.exercise_name,
    exercise_muscle_group: exercise.exercise_muscle_group,
    exercise_image: exercise.exercise_image,
  }));

  const { error: exercisesError } = await supabase
    .from("routine_exercises")
    .insert(rows);

  if (exercisesError) {
    return { ok: false, error: exercisesError.message };
  }

  return { ok: true, routineId: routine.routine_id };
}

export async function updateRoutine(
  userUid: string,
  routineId: string,
  name: string,
  selectedExercises: RoutineExerciseInput[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const validationError = validateRoutine(name, selectedExercises.length);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const { error: routineError } = await supabase
    .from("routines")
    .update({ name: name.trim() })
    .eq("user_uid", userUid)
    .eq("routine_id", routineId);

  if (routineError) {
    return { ok: false, error: routineError.message };
  }

  const { error: deleteError } = await supabase
    .from("routine_exercises")
    .delete()
    .eq("user_uid", userUid)
    .eq("routine_id", routineId);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  const rows = selectedExercises.map((exercise) => ({
    routine_id: routineId,
    user_uid: userUid,
    exercise_id: exercise.exercise_id,
    exercise_name: exercise.exercise_name,
    exercise_muscle_group: exercise.exercise_muscle_group,
    exercise_image: exercise.exercise_image,
  }));

  const { error: insertError } = await supabase
    .from("routine_exercises")
    .insert(rows);

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return { ok: true };
}

export async function deleteRoutine(
  userUid: string,
  routineId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("user_uid", userUid)
    .eq("routine_id", routineId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
