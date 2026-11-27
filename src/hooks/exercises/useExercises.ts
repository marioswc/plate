import {
  Exercise,
  ExerciseFilters,
  EXERCISES_PAGE_LIMIT,
  getExercises,
} from "@/services/exercises/ExerciseService";
import { useEffect, useState } from "react";

export function useExercises({
  level,
  primaryMuscles,
  force,
}: ExerciseFilters) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFirstPage() {
      setLoading(true);
      setError(null);
      setPage(1);

      const result = await getExercises(
        { level, primaryMuscles, force, page: 1 },
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      if (result.ok) {
        setExercises(result.data);
        setHasMore(result.data.length === EXERCISES_PAGE_LIMIT);
      } else {
        setError(result.error);
        setHasMore(false);
      }

      setLoading(false);
    }

    loadFirstPage();

    return () => {
      controller.abort();
    };
  }, [level, primaryMuscles, force]);

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    const result = await getExercises({
      level,
      primaryMuscles,
      force,
      page: nextPage,
    });

    if (result.ok) {
      setExercises((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.data.length === EXERCISES_PAGE_LIMIT);
    } else {
      setError(result.error);
    }

    setLoadingMore(false);
  };

  return { exercises, loading, loadingMore, hasMore, error, loadMore };
}
