'use client'
import { useState } from 'react'
import axios from 'axios'

export default function ChatBox(){
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role:string, text:string}[]>([])
  const [loading, setLoading] = useState(false)

  async function send() {
    if(!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, {role:'user', text:userMsg}])
    setInput(''); setLoading(true)
    try {
      const res = await axios.post('/analyze', { prompt: userMsg, confirm: false })
      if(res.data && res.data.generation){
        setMessages(prev => [...prev, {role:'assistant', text: res.data.generation}])
      } else if(res.data && res.data.status==='require_confirm') {
        alert('Prompt classified suspicious. Please confirm to proceed.')
      } else {
        setMessages(prev => [...prev, {role:'assistant', text: 'No response from AI.'}])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {role:'assistant', text: 'Error contacting server.'}])
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h3 className="neon">Chat with ISJPS AI</h3>
      <div className="mt-4 p-4 rounded card max-h-96 overflow-auto space-y-3">
        {messages.map((m,i)=> (
          <div key={i} className={m.role==='user' ? 'text-right' : ''}>
            <div className={m.role==='user' ? 'inline-block p-2 rounded bg-panel' : 'inline-block p-2 rounded bg-panel'}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 rounded" placeholder="Type your message..." />
        <button onClick={send} className="neon-btn" disabled={loading}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
