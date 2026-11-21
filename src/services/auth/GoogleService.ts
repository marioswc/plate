import { supabase } from "@/lib/supabase";
import { FieldErrors } from "@/services/auth/RegisterService";
import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export type GoogleAuthField = "form";

export type GoogleAuthResult =
  | { ok: true; data: { user: User | null; session: Session | null } }
  | { ok: false; cancelled?: boolean; errors: FieldErrors<GoogleAuthField> };

function extractParamsFromUrl(url: string) {
  const parsedUrl = new URL(url);
  const queryParams = new URLSearchParams(parsedUrl.search);
  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));

  return {
    code: queryParams.get("code"),
    accessToken:
      hashParams.get("access_token") ?? queryParams.get("access_token"),
    refreshToken:
      hashParams.get("refresh_token") ?? queryParams.get("refresh_token"),
    errorDescription:
      queryParams.get("error_description") ??
      hashParams.get("error_description") ??
      queryParams.get("error") ??
      hashParams.get("error"),
  };
}

export async function googleAuthService(): Promise<GoogleAuthResult> {
  try {
    const redirectTo = Linking.createURL("auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error || !data?.url) {
      return {
        ok: false,
        errors: {
          form: "Could not start Google sign-in. Please try again.",
        },
      };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type === "cancel" || result.type === "dismiss") {
      return { ok: false, cancelled: true, errors: {} };
    }

    if (result.type !== "success" || !result.url) {
      return {
        ok: false,
        errors: { form: "Google sign-in was not completed." },
      };
    }

    const { code, accessToken, refreshToken, errorDescription } =
      extractParamsFromUrl(result.url);

    if (errorDescription) {
      return {
        ok: false,
        errors: { form: errorDescription },
      };
    }

    if (code) {
      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        return {
          ok: false,
          errors: {
            form: "Could not complete Google sign-in. Please try again.",
          },
        };
      }

      return {
        ok: true,
        data: { user: sessionData.user, session: sessionData.session },
      };
    }

    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      if (sessionError) {
        return {
          ok: false,
          errors: {
            form: "Could not restore Google session. Please try again.",
          },
        };
      }

      return {
        ok: true,
        data: { user: sessionData.user, session: sessionData.session },
      };
    }

    return {
      ok: false,
      errors: { form: "No authentication credentials were returned." },
    };
  } catch {
    return {
      ok: false,
      errors: { form: "Google sign-in failed. Please try again later." },
    };
  }
}
