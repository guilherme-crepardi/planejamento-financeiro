"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return !!url && url !== "sua_url_aqui" && url !== "https://placeholder.supabase.co";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          });
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      const saved = localStorage.getItem("pf_user");
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return { error: error.message };
          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
            });
          }
        } else {
          const users = JSON.parse(localStorage.getItem("pf_users") || "[]") as Array<{ email: string; password: string; id: string; name: string }>;
          const found = users.find((u) => u.email === email && u.password === password);
          if (!found) return { error: "Email ou senha incorretos" };
          const u = { id: found.id, email: found.email, name: found.name };
          setUser(u);
          localStorage.setItem("pf_user", JSON.stringify(u));
        }
        return {};
      } catch {
        return { error: "Erro ao fazer login" };
      }
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (error) return { error: error.message };
          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || "",
              name,
            });
          }
        } else {
          const users = JSON.parse(localStorage.getItem("pf_users") || "[]") as Array<{ email: string }>;
          if (users.find((u) => u.email === email)) {
            return { error: "Email ja cadastrado" };
          }
          const id = crypto.randomUUID();
          const newUser = { id, email, password, name };
          users.push(newUser);
          localStorage.setItem("pf_users", JSON.stringify(users));
          const u = { id, email, name };
          setUser(u);
          localStorage.setItem("pf_user", JSON.stringify(u));
        }
        return {};
      } catch {
        return { error: "Erro ao criar conta" };
      }
    },
    []
  );

  const signOut = useCallback(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut();
    }
    localStorage.removeItem("pf_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
