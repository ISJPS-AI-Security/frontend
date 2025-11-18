"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchMe } from "@/lib/auth";

type User = { uid: string; email: string; role: string; blocked?: boolean } | null;

const AuthContext = createContext<{
  user: User;
  loadingUser: boolean;
  refresh: () => Promise<void>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true); // NEW

  async function refresh() {
    setLoadingUser(true); // start loading
    try {
      const me = await fetchMe();
      setUser(me);
      localStorage.setItem("role", me.role);
    } catch (e) {
      setUser(null);
      localStorage.removeItem("role");
    } finally {
      setLoadingUser(false); // finished loading
    }
  }

  useEffect(() => {
    // Try to load on mount
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
