// components/Navbar.tsx
'use client';
import { useRouter } from 'next/navigation';
import { logout } from '../lib/firebase';
import { useEffect, useState } from 'react';

export default function Navbar({ role } : { role: string }){
  const router = useRouter();
  const [r, setR] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('role');
      if (stored) setR(stored);
      else if (role) setR(role);
    } catch (e) {}
  }, [role]);

  function onToggleTheme() {
    // call global toggle provided by ThemeProvider
    if ((window as any).ISJPS?.toggleTheme) (window as any).ISJPS.toggleTheme();
    else window.dispatchEvent(new CustomEvent('isjps:toggle-theme', { detail: {} }));
  }

  // style the toggle button by role: we will rely on CSS variables for colors,
  // but add a small colored circle to indicate role
  return (
    <nav className="flex items-center justify-between p-4" style={{ background: 'linear-gradient(90deg,var(--primary),var(--accent-hover))', color: 'var(--accent-text-on)' }}>
      <div className="font-bold">ISJPS</div>
      <div className="flex gap-3 items-center">
        <button onClick={()=>router.push('/chat')} className="px-3 py-1 rounded bg-white/10">Chat</button>
        <button onClick={()=>router.push('/user')} className="px-3 py-1 rounded bg-white/10">My</button>
        {r==='manager' && <button onClick={()=>router.push('/manager')} className="px-3 py-1 rounded bg-white/10">Manager</button>}
        {r==='admin' && <button onClick={()=>router.push('/admin')} className="px-3 py-1 rounded bg-white/10">Admin</button>}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          title="Toggle theme (light / dark)"
        >
          <span style={{ width: 12, height: 12, display: 'inline-block', borderRadius: 6, background: 'var(--primary)' }} />
          <span className="hidden sm:inline" style={{ marginLeft: 6 }}>Theme</span>
        </button>

        <button onClick={async ()=>{ await logout(); localStorage.removeItem('role'); router.push('/'); }} className="px-3 py-1 rounded bg-white/10">Logout</button>
      </div>
    </nav>
  );
}
