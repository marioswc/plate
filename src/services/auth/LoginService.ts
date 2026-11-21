import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;

export interface LoginInput {
  email: string;
  password: string;
}

export type LoginField = "email" | "password" | "form";

export type FieldErrors<TField extends string> = Partial<
  Record<TField, string>
>;

export type AuthActionResult =
  | { ok: true; data: { user: User | null; session: Session | null } }
  | { ok: false; errors: FieldErrors<LoginField> };

export function validateLogin(input: LoginInput): FieldErrors<LoginField> {
  const errors: FieldErrors<LoginField> = {};

  const email = input.email.trim().toLowerCase();
  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email";
  }
  if (!input.password) {
    errors.password = "Password is required";
  } else if (input.password.length < 8) {
    errors.password = "Must be at least 8 characters long";
  }
  return errors;
}

function mapLoginError(message: string): FieldErrors<LoginField> {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return { form: "Invalid email or password" };
  }
  if (lower.includes("email")) {
    return { email: "Email is not registered" };
  }
  if (lower.includes("too many requests")) {
    return {
      form: "Demasiados intentos. Espera un momento e intenta de nuevo.",
    };
  }
  return { form: "Login failed. Please try again later" };
}

export async function loginService(
  input: LoginInput,
): Promise<AuthActionResult> {
  const fieldErrors = validateLogin(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, errors: fieldErrors };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });

  if (error) {
    return {
      ok: false,
      errors: mapLoginError(error.message),
    };
  }

  return {
    ok: true,
    data: { user: data.user, session: data.session },
  };
}
