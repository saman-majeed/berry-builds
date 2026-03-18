import Link from 'next/link'

interface Stats {
  projects: string
  clients: string
  satisfaction: string
  experience: string
}

export default function HeroSection({ stats }: { stats: Stats }) {
  return (
    <section style={{
      minHeight: 'calc(100vh - 66px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '80px 5%',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Backgrounds */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(109,40,217,.2), transparent 70%), radial-gradient(ellipse 40% 35% at 85% 75%, rgba(139,92,246,.12), transparent)',
      }} />
      <div className="hero-grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
          background: 'rgba(109,40,217,.12)', border: '1px solid rgba(109,40,217,.35)',
          color: 'var(--accent3)', padding: '0.28rem 0.9rem', borderRadius: '100px',
          fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>⚡ Software Development & AI Solutions</div>

        <h1 className="animate-fade-up" style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(2.3rem, 5.5vw, 4.8rem)',
          lineHeight: 1.06, letterSpacing: '-0.035em',
          color: 'white', maxWidth: '800px',
          animationDelay: '0.08s',
        }}>
          We Build Digital Products<br />
          <span className="grad-text">That Scale</span>
        </h1>

        <p style={{
          color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '540px',
          margin: '1.2rem auto 2rem',
        }}>
          From cutting-edge web applications to intelligent AI systems, we help businesses transform their ideas into powerful digital solutions.
        </p>

        <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{
            background: 'var(--accent)', color: 'white', padding: '0.7rem 1.7rem',
            borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
            textDecoration: 'none', boxShadow: '0 0 20px var(--glow)',
          }}>Start Your Project</Link>
          <Link href="/projects" style={{
            border: '1px solid var(--border)', color: 'var(--text)',
            padding: '0.7rem 1.7rem', borderRadius: '8px', fontWeight: 500,
            fontSize: '0.9rem', textDecoration: 'none',
          }}>View Our Work →</Link>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '2px', marginTop: '4rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '13px', overflow: 'hidden', maxWidth: '720px', width: '100%',
        }}>
          {[
            { value: stats.projects, label: 'Projects Delivered' },
            { value: stats.clients, label: 'Happy Clients' },
            { value: stats.satisfaction, label: 'Client Satisfaction' },
            { value: stats.experience, label: 'Years Experience' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: '1 1 140px', textAlign: 'center', padding: '1.5rem 1rem',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <div className="stat-num">{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.74rem', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
