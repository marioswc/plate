const BASE_URL = "https://libapi.vercel.app/api";
export const EXERCISES_PAGE_LIMIT = 20;

export interface Exercise {
  _id: string;
  id: string;
  name: string;
  level: string | null;
  force: string | null;
  primaryMuscles: string[];
  images: string[];
}

export interface ExerciseFilters {
  level?: string | null;
  primaryMuscles?: string | null;
  force?: string | null;
  page?: number;
}

export type ExerciseResult =
  | { ok: true; data: Exercise[] }
  | { ok: false; error: string };

export function getExerciseImageUrl(exerciseId: string, imageIndex = 0) {
  return `${BASE_URL}/exercises/${encodeURIComponent(exerciseId)}/${imageIndex}.jpg`;
}

export async function getExercises(
  filters: ExerciseFilters = {},
  signal?: AbortSignal,
): Promise<ExerciseResult> {
  const params = new URLSearchParams({
    lang: "en",
    limit: String(EXERCISES_PAGE_LIMIT),
    page: String(filters.page ?? 1),
  });

  if (filters.level) {
    params.set("level", filters.level);
  }
  if (filters.primaryMuscles) {
    params.set("primaryMuscles", filters.primaryMuscles);
  }
  if (filters.force) {
    params.set("force", filters.force);
  }

  try {
    const response = await fetch(`${BASE_URL}/exercises?${params.toString()}`, {
      signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 404 || data?.message === "No exercises found.") {
        return { ok: true, data: [] };
      }

      return {
        ok: false,
        error: data?.message ?? "Could not load exercises. Please try again.",
      };
    }

    if (!Array.isArray(data)) {
      return { ok: true, data: [] };
    }

    return { ok: true, data };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, error: "aborted" };
    }

    return {
      ok: false,
      error: "Network error. Check your connection and try again.",
    };
  }
}
