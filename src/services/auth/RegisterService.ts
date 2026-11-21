import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;

export interface RegisterInput {
  email: string;
  full_name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export type RegisterField =
  | "email"
  | "full_name"
  | "username"
  | "password"
  | "confirmPassword"
  | "form";

export type FieldErrors<TField extends string> = Partial<
  Record<TField, string>
>;

export type AuthActionResult =
  | { ok: true; data: { user: User | null; session: Session | null } }
  | { ok: false; errors: FieldErrors<RegisterField> };

export function validateRegister(
  input: RegisterInput,
): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {};

  const email = input.email.trim().toLowerCase();
  const fullName = input.full_name.trim();
  const username = input.username.trim().toLowerCase();

  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!fullName) {
    errors.full_name = "Field is required";
  } else if (fullName.length < 3) {
    errors.full_name = "Must be at least 3 letters";
  }

  if (!username) {
    errors.username = "Username is required";
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username = "Must be at least 3 letters";
  }

  if (!input.password) {
    errors.password = "Password is required";
  } else if (input.password.length < 8) {
    errors.password = "Must be at least 8 characters long";
  }

  if (!input.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return errors;
}

function mapRegisterError(message: string): FieldErrors<RegisterField> {
  const lower = message.toLowerCase();

  if (
    lower.includes("already registered") ||
    lower.includes("already exists")
  ) {
    return { email: "Email is already taken" };
  }

  if (lower.includes("password")) {
    return {
      password: "Password is too weak. Must be at least 8 characters long",
    };
  }
  if (lower.includes("username")) {
    return { username: "Username is already taken" };
  }

  return { form: "Registration failed. Please try again later" };
}

export async function registerService(
  input: RegisterInput,
): Promise<AuthActionResult> {
  const fieldErrors = validateRegister(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, errors: fieldErrors };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.full_name.trim();
  const username = input.username.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: fullName,
        username,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      errors: mapRegisterError(error.message),
    };
  }

  return {
    ok: true,
    data: { user: data.user, session: data.session },
  };
}
