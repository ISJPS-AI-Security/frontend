// components/HeaderAuth.tsx
'use client'

import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase' // keep your existing file
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HeaderAuth() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [])

  async function handleLogout() {
    try {
      await signOut(auth)
      // optionally redirect to login page
      router.push('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  if (!user) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-3 py-1 rounded border neon-btn"
      >
        Sign in
      </Link>
    </div>
  )
}

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <img
          src={user.photoURL || '/avatar-placeholder.png'}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border"
        />
        <span className="text-sm">{user.displayName || user.email}</span>
      </div>
      <button onClick={handleLogout} className="px-3 py-1 rounded border neon-btn">
        Logout
      </button>
    </div>
  )
}
