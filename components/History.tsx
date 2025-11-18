'use client'
import { useState, useEffect } from 'react'

export default function History() {
  const [logs, setLogs] = useState<any[]>([])
  useEffect(() => {
    setLogs([
      { id: '1', action: 'login', user: 'rabin@example.com', time: '2025-10-31T12:00:00Z' },
      { id: '2', action: 'generate', user: 'anon', time: '2025-10-30T08:12:00Z' }
    ])
  }, [])
  return (
    <div>
      <h3 className="neon">Recent Activity</h3>
      <ul className="mt-4 space-y-2">
        {logs.map(l => (
          <li key={l.id} className="p-3 rounded card">
            <div className="flex justify-between"><div>{l.action} — {l.user}</div><div className="text-sm">{new Date(l.time).toLocaleString()}</div></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
