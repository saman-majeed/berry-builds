'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({ messages: 0, newMessages: 0, projects: 0, services: 0, team: 0 })
  const [recentMsgs, setRecentMsgs] = useState<any[]>([])
  const [svcChart, setSvcChart] = useState<[string, number][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/messages').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/team').then(r => r.json()),
    ]).then(([msgs, projs, svcs, team]) => {
      const newMsgs = msgs.filter((m: any) => m.status === 'new')
      setStats({ messages: msgs.length, newMessages: newMsgs.length, projects: projs.filter((p: any) => p.status === 'active').length, services: svcs.filter((s: any) => s.status === 'active').length, team: team.length })
      setRecentMsgs(msgs.slice(0, 5))
      // service interest chart
      const cnt: Record<string, number> = {}
      msgs.forEach((m: any) => { if (m.service) cnt[m.service] = (cnt[m.service] || 0) + 1 })
      setSvcChart(Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6) as [string, number][])
      setLoading(false)
    })
  }, [])

  const StatCard = ({ ico, val, label, badge, color }: any) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{ico}</div>
        {badge && <span style={{ background: 'rgba(109,40,217,.2)', color: 'var(--accent3)', fontSize: '0.7rem', padding: '0.12rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{badge}</span>}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: 'white' }}>{val}</div>
      <div style={{ color: 'var(--muted)', fontSize: '0.76rem', marginTop: '0.2rem' }}>{label}</div>
    </div>
  )

  const max = svcChart.length ? Math.max(...svcChart.map(([, v]) => v)) : 1

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', color: 'white' }}>Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginTop: '0.2rem' }}>Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/admin/messages" style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '7px', fontWeight: 600, fontSize: '0.83rem', textDecoration: 'none' }}>View Messages</Link>
      </div>

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard ico="💬" val={stats.messages} label="Total Messages" badge={stats.newMessages > 0 ? `${stats.newMessages} new` : undefined} color="rgba(59,130,246,.2)" />
            <StatCard ico="🗂️" val={stats.projects} label="Active Projects" color="rgba(109,40,217,.2)" />
            <StatCard ico="⚙️" val={stats.services} label="Active Services" color="rgba(16,185,129,.2)" />
            <StatCard ico="👥" val={stats.team} label="Team Members" color="rgba(245,158,11,.2)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
            {/* Activity */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.3rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', color: 'white', marginBottom: '1rem' }}>Recent Activity</h3>
              {recentMsgs.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>No activity yet</p> :
                recentMsgs.map((m: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '0.7rem', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.status === 'new' ? 'var(--accent3)' : m.status === 'replied' ? '#10b981' : '#3b82f6', flexShrink: 0, marginTop: '0.35rem' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{m.firstName} {m.lastName} — {m.service}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--muted)' }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            {/* Chart */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.3rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', color: 'white', marginBottom: '1rem' }}>Services by Interest</h3>
              {svcChart.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>No data yet — submit contact forms to see stats</p> :
                svcChart.map(([name, val]) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.76rem', width: '80px', flexShrink: 0, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={name}>{name.split(' ')[0]}</div>
                    <div style={{ flex: 1, background: 'var(--border)', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, var(--accent), var(--accent3))', width: `${Math.round(val / max * 100)}%`, transition: 'width .6s' }} />
                    </div>
                    <div style={{ color: 'var(--text)', fontSize: '0.76rem', width: '20px', flexShrink: 0 }}>{val}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Recent messages table */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.3rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', color: 'white' }}>Recent Messages</h3>
              <Link href="/admin/messages" style={{ color: 'var(--accent3)', fontSize: '0.8rem', textDecoration: 'none' }}>View all →</Link>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Service</th><th>Budget</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {recentMsgs.length === 0 ? <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No messages yet</td></tr> :
                  recentMsgs.map((m: any) => (
                    <tr key={m.id}>
                      <td style={{ color: 'white', fontWeight: 600 }}>{m.firstName} {m.lastName}</td>
                      <td>{m.service || '—'}</td>
                      <td>{m.budget || '—'}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td><Badge status={m.status} /></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    new:     { bg: 'rgba(109,40,217,.15)', color: 'var(--accent3)' },
    read:    { bg: 'rgba(59,130,246,.15)',  color: '#60a5fa' },
    replied: { bg: 'rgba(16,185,129,.15)',  color: '#34d399' },
  }
  const c = colors[status] || colors.read
  return <span style={{ ...c, padding: '0.15rem 0.55rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 600 }}>{status}</span>
}
