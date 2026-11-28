import { getRoutines, Routine } from "@/services/exercises/RoutineService";
import { useCallback, useEffect, useState } from "react";

export function useRoutines(userUid?: string) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async () => {
    if (!userUid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getRoutines(userUid);
    if (result.ok) {
      setRoutines(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [userUid]);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  return { routines, loading, error, refetch: fetchRoutines };
}
