import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type AuthData = {
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
});

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(_children: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // fetch the current session on component mount
    async function fetchSession() {
      const { error, data } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        throw error; // throw the error to be caught by the outer try-catch
      }
      if (data.session) {
        // if session exists, set it
        setSession(data.session);
      } else {
        // if no session, redirect to login
        router.replace("/login");
      }
      setLoading(false);
    }
    fetchSession();
    // listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.replace("/login");
      } else {
        router.replace("/feed");
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ loading, session }}>
      {_children.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
