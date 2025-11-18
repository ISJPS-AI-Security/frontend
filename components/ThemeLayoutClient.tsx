// components/ThemeLayoutClient.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ThemeLayoutClient({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string>('user')
  const [dark, setDark] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // load from localStorage (or default)
    const r = (typeof window !== 'undefined' && localStorage.getItem('isjps_role')) || 'user'
    const d = (typeof window !== 'undefined' && localStorage.getItem('isjps_dark')) === 'true'
    setRole(r)
    setDark(d)
    applyTheme(r, d)
  }, [])

  function applyTheme(r: string, d: boolean) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', d)
    root.setAttribute('data-role', r)
  }

  function switchRole(newRole: string) {
    localStorage.setItem('isjps_role', newRole)
    setRole(newRole)
    applyTheme(newRole, dark)
  }

  function toggleDark() {
    const nd = !dark
    localStorage.setItem('isjps_dark', nd.toString())
    setDark(nd)
    applyTheme(role, nd)
  }

  return (
    <div className="min-h-screen transition-colors duration-300 p-4">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="ml-4">
            {/* HeaderAuth is inserted by layout, but keep space for logo */}
          </div>
          <h1 className="text-2xl neon">ISJPS Dashboard</h1>
        </div>

        <div className="flex gap-3 items-center">
          <label className="text-sm">Role</label>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="px-3 py-1 rounded bg-transparent border border-current"
          >
            <option value="user">User (Blue)</option>
            <option value="manager">Manager (Green)</option>
            <option value="admin">Admin (Red)</option>
          </select>

          <button
            onClick={toggleDark}
            className="px-3 py-1 rounded neon-btn"
            aria-pressed={dark}
          >
            Toggle Dark
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}
