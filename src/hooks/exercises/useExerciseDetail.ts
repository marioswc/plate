import {
  ExerciseDetail,
  getExerciseById,
} from "@/services/exercises/ExerciseService";
import { useEffect, useState } from "react";

export function useExerciseDetail(id?: string) {
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Exercise ID not provided.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadDetail() {
      setLoading(true);
      setError(null);

      const result = await getExerciseById(id!, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      if (result.ok) {
        setExercise(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    }

    loadDetail();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { exercise, loading, error };
}
