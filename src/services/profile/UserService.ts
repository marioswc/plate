import { supabase } from "@/lib/supabase";

export interface UserProfile {
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
}

export type ProfileResult =
  | { ok: true; data: UserProfile }
  | { ok: false; error: string };

export async function getUserProfile(userUid: string): Promise<ProfileResult> {
  const [profileRes, followersRes, followingRes] = await Promise.all([
    supabase
      .from("users")
      .select("username, full_name, bio, avatar_url")
      .eq("user_uid", userUid)
      .single(),
    supabase
      .from("following_list")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userUid),
    supabase
      .from("following_list")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userUid),
  ]);

  if (profileRes.error) {
    return { ok: false, error: profileRes.error.message };
  }

  if (followersRes.error) {
    return { ok: false, error: followersRes.error.message };
  }

  if (followingRes.error) {
    return { ok: false, error: followingRes.error.message };
  }

  return {
    ok: true,
    data: {
      ...profileRes.data,
      followers_count: followersRes.count ?? 0,
      following_count: followingRes.count ?? 0,
    },
  };
}
