'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

type User = { uid: string, email: string, role: string, daily_quota_left?: number, blocked_until?: string }

async function getAuthToken() {
  try {
    // @ts-ignore
    if (window.firebase && window.firebase.auth) {
      // @ts-ignore
      const user = window.firebase.auth().currentUser
      if (user) {
        // @ts-ignore
        const token = await user.getIdToken()
        return token
      }
    }
  } catch (e) {}
  return localStorage.getItem('firebase_token')
}

export default function UsersAdmin(){
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=> { fetchUsers() },[])

  async function fetchUsers(){
    setLoading(true)
    const token = await getAuthToken()
    try {
      const res = await axios.get('/admin/users', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      setUsers(res.data.users || [])
    } catch (err) {
      console.error(err)
      alert('Failed to fetch users. Make sure backend is running and Authorization header is set.')
    } finally { setLoading(false) }
  }

  async function setQuota(uid: string, quota: number){
    const token = await getAuthToken()
    try {
      await axios.post('/admin/set_quota', { uid, quota }, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      alert('Quota set'); fetchUsers()
    } catch (err) { console.error(err); alert('Failed to set quota') }
  }

  async function setRole(uid: string, role: string){
    const token = await getAuthToken()
    try {
      await axios.post('/admin/set_role', { uid, role }, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      alert('Role updated'); fetchUsers()
    } catch (err) { console.error(err); alert('Failed to set role') }
  }

  async function tempBlock(uid: string){
    const minutes = parseInt(prompt('Block for how many minutes?', '60') || '60', 10)
    const token = await getAuthToken()
    try {
      await axios.post('/admin/temp_block', { uid, minutes }, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      alert('User temp-blocked'); fetchUsers()
    } catch (err) { console.error(err); alert('Failed to temp-block') }
  }

  async function deleteUser(uid: string){
    if(!confirm('Delete this user permanently?')) return
    const token = await getAuthToken()
    try {
      await axios.post('/admin/delete_user', { uid }, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      alert('User deleted'); fetchUsers()
    } catch (err) { console.error(err); alert('Failed to delete user') }
  }

  return (
    <div>
      <h3 className="neon">Users & Controls</h3>
      {loading ? <div>Loading...</div> : null}
      <div className="mt-4 space-y-3">
        {users.map(u => (
          <div key={u.uid} className="p-3 rounded card flex justify-between items-center">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-sm">Role: <span className="font-semibold">{u.role}</span> · Quota: {u.daily_quota_left ?? '-'}</div>
              {u.blocked_until ? <div className="text-xs">Blocked until: {new Date(u.blocked_until).toLocaleString()}</div> : null}
            </div>
            <div className="flex gap-2">
              <button onClick={()=> setQuota(u.uid, 0)} className="neon-btn">Temp Block (quota 0)</button>
              <button onClick={()=> tempBlock(u.uid)} className="neon-btn">Temp Block (minutes)</button>
              <button onClick={()=> setRole(u.uid, u.role==='manager'?'user':'manager')} className="neon-btn">Toggle Manager</button>
              <button onClick={()=> deleteUser(u.uid)} className="neon-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
