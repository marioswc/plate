import { getUserProfile, UserProfile } from "@/services/profile/UserService";
import { useCallback, useEffect, useState } from "react";

export function useUserProfile(userUid?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userUid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getUserProfile(userUid);
    if (result.ok) {
      setProfile(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [userUid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
