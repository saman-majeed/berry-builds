import Link from 'next/link'

const thumbColors = [
  'linear-gradient(135deg,#1e3a5f,#0f2038)',
  'linear-gradient(135deg,#1a3828,#0d1f16)',
  'linear-gradient(135deg,#2d1b5e,#180f38)',
]

export default function ProjectsPreview({ projects }: { projects: any[] }) {
  return (
    <section style={{ padding: '80px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Work</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.7rem,3.5vw,2.7rem)', color: 'white', letterSpacing: '-0.025em', margin: '0.5rem 0' }}>Featured Projects</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto' }}>Real-world solutions we've built for clients across industries.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.2rem' }}>
        {projects.map((p: any, i: number) => (
          <Link key={p.id} href="/projects" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', display: 'block',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{
              height: '160px',
              background: thumbColors[i % 3],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{
                position: 'absolute', top: '0.6rem', left: '0.6rem',
                background: 'rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.1)',
                color: 'var(--muted)', fontSize: '0.64rem', fontWeight: 600,
                padding: '0.15rem 0.5rem', borderRadius: '5px', textTransform: 'uppercase',
                zIndex: 2
              }}>{p.tag || p.category}</span>

              {/* IMAGE LOGIC */}
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '3.2rem' }}>{p.emoji || '🌐'}</span>
              )}
            </div>
            <div style={{ padding: '1.1rem 1.3rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{p.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.81rem' }}>{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
        <Link href="/projects" style={{
          border: '1px solid var(--border)', color: 'var(--text)', padding: '0.7rem 1.7rem',
          borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none',
        }}>View All Projects</Link>
      </div>
    </section>
  )
}