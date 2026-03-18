'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image' // Added for the logo
import { usePathname, useRouter } from 'next/navigation'

interface User { id: number; username: string; role: string }
interface AuthCtx { user: User | null; logout: () => void }
const Auth = createContext<AuthCtx>({ user: null, logout: () => { } })
export const useAuth = () => useContext(Auth)

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/messages', icon: '💬', label: 'Messages' },
  { href: '/admin/projects', icon: '🗂️', label: 'Projects' },
  { href: '/admin/services', icon: '⚙️', label: 'Services' },
  { href: '/admin/stats', icon: '📈', label: 'Site Stats' },
  { href: '/admin/team', icon: '👥', label: 'Team' },
  { href: '/admin/users', icon: '🔑', label: 'Users' },
  { href: '/admin/settings', icon: '🔧', label: 'Settings' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user) })
      .finally(() => setChecking(false))
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--muted)' }}>Loading...</div>
    </div>
  )

  if (!user) return <LoginScreen onLogin={setUser} />

  return (
    <Auth.Provider value={{ user, logout }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

          {/* LOGO ADDED HERE */}
          <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border)' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={28}
                height={28}
                style={{ borderRadius: '50%' }}
              />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                Berry<span style={{ color: 'var(--accent3)' }}>Builds</span>
              </span>
            </Link>
          </div>

          <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '30px', height: '30px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>{user.username}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>Administrator</div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '0.7rem 0' }}>
            {navItems.map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.62rem 1.2rem', fontSize: '0.83rem', textDecoration: 'none',
                color: pathname === item.href ? 'var(--accent3)' : 'var(--muted)',
                background: pathname === item.href ? 'rgba(109,40,217,.1)' : 'transparent',
                borderLeft: pathname === item.href ? '3px solid var(--accent3)' : '3px solid transparent',
                transition: 'all 0.18s',
              }}>
                <span style={{ fontSize: '1rem', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid var(--border)' }}>
            <button onClick={logout} style={{ width: '100%', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.5rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              ← Sign Out
            </button>
          </div>
        </aside>
        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>{children}</main>
      </div>
    </Auth.Provider>
  )
}

function LoginScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    if (!username || !password) { setError('Please enter credentials'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    const data = await res.json()
    setLoading(false)
    if (res.ok) onLogin(data.user)
    else setError(data.error || 'Invalid credentials')
  }

  const inp: React.CSSProperties = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '7px', padding: '0.65rem 0.9rem', color: 'var(--text)', fontSize: '0.88rem', outline: 'none', fontFamily: 'DM Sans, sans-serif' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>

          {/* LOGO ADDED TO LOGIN SCREEN */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.4rem' }}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              style={{ borderRadius: '50%' }}
            />
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: 'white' }}>
              Berry<span style={{ color: 'var(--accent3)' }}>Builds</span>
            </div>
          </div>

          <span style={{ background: 'rgba(109,40,217,.2)', color: 'var(--accent3)', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.7rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Portal</span>
          <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginTop: '0.8rem' }}>Sign in to access the admin panel</p>
        </div>
        {error && <div style={{ color: '#f87171', fontSize: '0.82rem', textAlign: 'center', marginBottom: '0.8rem', background: 'rgba(239,68,68,.1)', padding: '0.6rem', borderRadius: '6px' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem' }}>Username</label>
          <input style={inp} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem' }}>Password</label>
          <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <button onClick={login} disabled={loading} style={{ width: '100%', background: loading ? 'var(--border2)' : 'var(--accent)', color: 'white', border: 'none', padding: '0.72rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 20px var(--glow)' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ color: 'var(--muted)', fontSize: '0.74rem', textAlign: 'center', marginTop: '1rem' }}>Default: admin / berry2024</p>
      </div>
    </div>
  )
}