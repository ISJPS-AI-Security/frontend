'use client'
import { useState } from 'react'
import History from './History'
import UsersAdmin from './UsersAdmin'
import ChatBox from './ChatBox'

export default function Dashboard() {
  const [tab, setTab] = useState<'dashboard'|'history'|'users'|'chat'>('dashboard')
  return (
    <div className="space-y-6">
      <nav className="flex gap-3">
        <button onClick={() => setTab('dashboard')} className="neon-btn">Dashboard</button>
        <button onClick={() => setTab('history')} className="neon-btn">History</button>
        <button onClick={() => setTab('users')} className="neon-btn">Users / Admin</button>
        <button onClick={() => setTab('chat')} className="neon-btn">Chat</button>
      </nav>

      <section className="p-6 rounded-xl bg-panel">
        {tab === 'dashboard' && (
          <>
            <h2 className="text-xl neon">Welcome</h2>
            <p>Role-based theme is active. Switch role in the header to preview themes.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg shadow-sm card">Quota: <strong>Variable</strong></div>
              <div className="p-4 rounded-lg shadow-sm card">Usage: <strong>Tracking</strong></div>
              <div className="p-4 rounded-lg shadow-sm card">Notifications: <strong>0</strong></div>
            </div>
          </>
        )}
        {tab === 'history' && <History />}
        {tab === 'users' && <UsersAdmin />}
        {tab === 'chat' && <ChatBox />}
      </section>
    </div>
  )
}
