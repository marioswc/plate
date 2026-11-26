import { supabase } from "@/lib/supabase";
import { FieldErrors } from "@/services/auth/RegisterService";
import {
  AvatarUploadInput,
  uploadAvatarService,
  validateAvatar,
} from "@/services/profile/AvatarService";

const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;
export const BIO_MAX_LENGTH = 160;

export interface UpdateProfileInput {
  full_name: string;
  username: string;
  bio: string;
  avatar?: AvatarUploadInput | null;
}

export type UpdateProfileField =
  | "full_name"
  | "username"
  | "bio"
  | "avatar"
  | "form";

export type UpdateProfileResult =
  | {
      ok: true;
      data: {
        username: string;
        full_name: string;
        bio: string | null;
        avatar_url: string | null;
      };
    }
  | { ok: false; errors: FieldErrors<UpdateProfileField> };

export function validateUpdateProfile(
  input: UpdateProfileInput,
): FieldErrors<UpdateProfileField> {
  const errors: FieldErrors<UpdateProfileField> = {};

  const fullName = input.full_name.trim();
  const username = input.username.trim().toLowerCase();
  const bio = input.bio.trim();

  if (!fullName) {
    errors.full_name = "Name is required";
  } else if (fullName.length < 3) {
    errors.full_name = "Must be at least 3 characters";
  }

  if (!username) {
    errors.username = "Username is required";
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username = "3-20 characters: letters, numbers, dots or underscores";
  }

  if (bio.length > BIO_MAX_LENGTH) {
    errors.bio = `Bio must be ${BIO_MAX_LENGTH} characters or less`;
  }

  if (input.avatar) {
    const avatarError = validateAvatar(input.avatar);
    if (avatarError) {
      errors.avatar = avatarError;
    }
  }

  return errors;
}

function mapUpdateProfileError(error: {
  code?: string;
  message: string;
}): FieldErrors<UpdateProfileField> {
  const lower = error.message.toLowerCase();

  if (error.code === "23505" || lower.includes("username")) {
    return { username: "Username is already taken" };
  }

  return { form: "Could not update profile. Please try again." };
}

export async function updateProfileService(
  userUid: string,
  input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  const fieldErrors = validateUpdateProfile(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, errors: fieldErrors };
  }

  const fullName = input.full_name.trim();
  const username = input.username.trim().toLowerCase();
  const bio = input.bio.trim();

  let avatarUrl: string | undefined;
  if (input.avatar) {
    const uploadResult = await uploadAvatarService(userUid, input.avatar);
    if (!uploadResult.ok) {
      return {
        ok: false,
        errors: { avatar: uploadResult.error },
      };
    }
    avatarUrl = uploadResult.publicUrl;
  }

  const updatePayload: {
    full_name: string;
    username: string;
    bio: string | null;
    avatar_url?: string;
  } = {
    full_name: fullName,
    username,
    bio: bio || null,
  };

  if (avatarUrl) {
    updatePayload.avatar_url = avatarUrl;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("user_uid", userUid)
    .select("username, full_name, bio, avatar_url")
    .single();

  if (error) {
    return {
      ok: false,
      errors: mapUpdateProfileError(error),
    };
  }

  return { ok: true, data };
}
