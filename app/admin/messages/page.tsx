'use client'
import { useEffect, useState } from 'react'

function Badge({ status }: { status: string }) {
  const c: Record<string, { bg: string; color: string }> = {
    new:     { bg: 'rgba(109,40,217,.15)', color: 'var(--accent3)' },
    read:    { bg: 'rgba(59,130,246,.15)',  color: '#60a5fa' },
    replied: { bg: 'rgba(16,185,129,.15)',  color: '#34d399' },
  }
  const s = c[status] || c.read
  return <span style={{ ...s, padding: '0.15rem 0.55rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 600 }}>{status}</span>
}

export default function MessagesPage() {
  const [msgs, setMsgs] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/messages').then(r => r.json()).then(d => { setMsgs(d); setLoading(false) })
  }
  useEffect(load, [])

  const filtered = msgs.filter(m => {
    const matchFilter = filter === 'all' || m.status === filter
    const matchSearch = !search || `${m.firstName} ${m.lastName} ${m.email} ${m.service}`.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  async function updateStatus(id: number, status: string) {
    await fetch('/api/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
  }

  async function deleteMsg(id: number) {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
    setMsgs(prev => prev.filter(m => m.id !== id))
    setSelected(null)
  }

  async function clearAll() {
    if (!confirm('Clear ALL messages? This cannot be undone.')) return
    await fetch('/api/messages', { method: 'DELETE' })
    setMsgs([])
  }

  const inp: React.CSSProperties = { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '7px', padding: '0.4rem 0.8rem', color: 'var(--text)', fontSize: '0.82rem', outline: 'none', fontFamily: 'DM Sans, sans-serif' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', color: 'white' }}>Messages</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>Contact form submissions from clients.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <select style={inp} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <button onClick={clearAll} style={{ background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)', padding: '0.4rem 0.9rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Clear All</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '1.2rem' }}>
        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.3rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', color: 'white' }}>{filtered.length} Message{filtered.length !== 1 ? 's' : ''}</h3>
            <input style={{ ...inp, width: '200px' }} placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {loading ? <p style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center' }}>Loading...</p> : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)' }}>No messages found</td></tr> :
                  filtered.map(m => (
                    <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(m)}>
                      <td><span style={{ color: 'white', fontWeight: 600 }}>{m.firstName} {m.lastName}</span>{m.company && <div style={{ color: 'var(--muted)', fontSize: '0.73rem' }}>{m.company}</div>}</td>
                      <td>{m.email}</td>
                      <td>{m.service || '—'}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td><Badge status={m.status} /></td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => updateStatus(m.id, 'replied')} style={{ background: 'rgba(16,185,129,.15)', color: '#34d399', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}>✓ Replied</button>
                          <button onClick={() => deleteMsg(m.id)} style={{ background: 'rgba(239,68,68,.15)', color: '#f87171', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.5rem', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1rem' }}>Message Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
            </div>
            {[['Name', `${selected.firstName} ${selected.lastName}`], ['Email', selected.email], selected.phone && ['Phone', selected.phone], selected.company && ['Company', selected.company], ['Service', selected.service || '—'], ['Budget', selected.budget || '—'], ['Date', new Date(selected.createdAt).toLocaleString()], ['Status', selected.status]].filter(Boolean).map(([k, v]: any) => (
              <div key={k} style={{ marginBottom: '0.8rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{k}</div>
                {k === 'Status' ? <Badge status={v} /> : <div style={{ color: 'var(--text)', fontSize: '0.87rem' }}>{v}</div>}
              </div>
            ))}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Message</div>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '7px', padding: '0.9rem', color: 'var(--text)', fontSize: '0.87rem', lineHeight: 1.6 }}>{selected.details}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => updateStatus(selected.id, 'replied')} style={{ background: 'rgba(16,185,129,.15)', color: '#34d399', border: '1px solid rgba(16,185,129,.3)', padding: '0.4rem 0.9rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Mark Replied</button>
              <button onClick={() => updateStatus(selected.id, 'read')} style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '0.4rem 0.9rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Mark Read</button>
              <button onClick={() => deleteMsg(selected.id)} style={{ background: 'rgba(239,68,68,.15)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)', padding: '0.4rem 0.9rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
