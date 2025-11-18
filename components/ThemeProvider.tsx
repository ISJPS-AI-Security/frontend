// components/ThemeProvider.tsx
'use client';
import React, { useEffect, useState } from 'react';

type Role = 'user' | 'manager' | 'admin' | null;
type Mode = 'light' | 'dark';

const DEFAULT_ROLE: Role = null;
const DEFAULT_MODE: Mode = 'light';

function roleToBase(role: Role) {
  // Returns role base string to use in data-theme values.
  if (role === 'manager') return 'manager';
  if (role === 'admin') return 'admin';
  return 'user';
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);

  // read localStorage on mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('role') as Role | null;
      const storedTheme = localStorage.getItem('themeMode'); // e.g. "user-dark"
      if (storedRole) setRole(storedRole);
      if (storedTheme) {
        const [, m] = storedTheme.split('-');
        setMode(m === 'dark' ? 'dark' : 'light');
      }
    } catch (e) { /* ignore */ }
  }, []);

  // whenever role or mode changes, set data-theme attribute on html
  useEffect(() => {
    const base = roleToBase(role);
    const themeAttr = role ? `${base}-${mode}` : `user-${mode}`; // fallback to user
    document.documentElement.setAttribute('data-theme', themeAttr);
    // persist
    try {
      if (role) localStorage.setItem('role', role);
      localStorage.setItem('themeMode', `${base}-${mode}`);
    } catch (e) {}
  }, [role, mode]);

  // listen to global toggle event so Navbar can dispatch it
  useEffect(() => {
    function onToggle(e: Event) {
      const payload = (e as CustomEvent).detail as { direction?: 'toggle' };
      setMode(prev => prev === 'light' ? 'dark' : 'light');
    }
    window.addEventListener('isjps:toggle-theme', onToggle as EventListener);
    // also allow direct set via event 'isjps:set-role' with { role: 'manager' }
    function onSetRole(e: Event) {
      const payload = (e as CustomEvent).detail as { role?: Role, mode?: Mode };
      if (payload?.role) setRole(payload.role);
      if (payload?.mode) setMode(payload.mode);
    }
    window.addEventListener('isjps:set-role', onSetRole as EventListener);

    return () => {
      window.removeEventListener('isjps:toggle-theme', onToggle as EventListener);
      window.removeEventListener('isjps:set-role', onSetRole as EventListener);
    };
  }, []);

  // Provide a small context via window (so other components easily call toggle)
  useEffect(() => {
    (window as any).ISJPS = (window as any).ISJPS || {};
    (window as any).ISJPS.toggleTheme = () => {
      const ev = new CustomEvent('isjps:toggle-theme', { detail: { direction: 'toggle' }});
      window.dispatchEvent(ev);
    };
    (window as any).ISJPS.setRole = (r: Role) => {
      const ev = new CustomEvent('isjps:set-role', { detail: { role: r }});
      window.dispatchEvent(ev);
    };
  }, []);

  return <>{children}</>;
}