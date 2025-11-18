"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Role = "user" | "manager" | "admin" | null;
type Theme = "light" | "dark";

interface ThemeContextProps {
  role: Role;
  theme: Theme;
  setRole: (r: Role) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  role: null,
  theme: "light",
  setRole: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.body.className = `${theme} ${role ? role : ""}`;
  }, [theme, role]);

  return (
    <ThemeContext.Provider value={{ role, theme, setRole, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
