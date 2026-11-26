import { supabase } from "@/lib/supabase";
import { File } from "expo-file-system";
import { Platform } from "react-native";

const AVATAR_BUCKET = "photos";
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
};

export interface AvatarUploadInput {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
}

export type AvatarUploadResult =
  | { ok: true; publicUrl: string }
  | { ok: false; error: string };

export function validateAvatar(avatar: AvatarUploadInput): string | null {
  const mime = avatar.mimeType?.toLowerCase().trim();
  if (!mime || !ALLOWED_TYPES[mime]) {
    return "Unsupported image format. Use JPG, PNG, HEIC, or HEIF.";
  }

  if (avatar.fileSize && avatar.fileSize > MAX_SIZE_BYTES) {
    return "Image must be 4 MB or smaller.";
  }

  return null;
}

export async function uploadAvatarService(
  userUid: string,
  avatar: AvatarUploadInput,
): Promise<AvatarUploadResult> {
  const validationError = validateAvatar(avatar);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const mime = avatar.mimeType!.toLowerCase().trim();
  const contentType = mime === "image/jpg" ? "image/jpeg" : mime;
  const filePath = `avatars/${userUid}/avatar.${ALLOWED_TYPES[mime]}`;

  try {
    const arrayBuffer =
      Platform.OS === "web"
        ? await (await fetch(avatar.uri)).arrayBuffer()
        : await new File(avatar.uri).arrayBuffer();

    if (arrayBuffer.byteLength > MAX_SIZE_BYTES) {
      return { ok: false, error: "Image must be 4 MB or smaller." };
    }

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, arrayBuffer, { contentType, upsert: true });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("size")) {
        return { ok: false, error: "Image must be 4 MB or smaller." };
      }
      if (msg.includes("mime")) {
        return {
          ok: false,
          error: "Unsupported image format. Use JPG, PNG, HEIC, or HEIF.",
        };
      }
      return {
        ok: false,
        error: "Could not upload profile photo. Please try again.",
      };
    }

    const { data } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    return { ok: true, publicUrl: `${data.publicUrl}?t=${Date.now()}` };
  } catch {
    return {
      ok: false,
      error: "Could not upload profile photo. Please try again.",
    };
  }
}
