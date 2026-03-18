import Link from 'next/link'

// ─── ServicesGrid ─────────────────────────────────────────
export default function ServicesGrid({ services }: { services: any[] }) {
  return (
    <section style={{ background: 'var(--surface)', padding: '80px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>What We Do</span>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.7rem,3.5vw,2.7rem)', color: 'white', letterSpacing: '-0.025em', margin: '0.5rem 0' }}>Our Services</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto' }}>Comprehensive digital solutions tailored to your business needs.</p>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1px', background: 'var(--border)',
        border: '1px solid var(--border)', borderRadius: '13px', overflow: 'hidden',
      }}>
        {services.map((s: any) => (
          <Link key={s.id} href="/services" style={{
            background: 'var(--surface2)', padding: '1.7rem 1.5rem',
            textDecoration: 'none', display: 'block',
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'rgba(109,40,217,.14)', border: '1px solid rgba(109,40,217,.28)',
              borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', fontSize: '1.15rem',
            }}>{s.icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.97rem', color: 'white', marginBottom: '0.35rem' }}>{s.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.83rem', lineHeight: 1.5 }}>{s.shortDesc}</p>
            <span style={{ color: 'var(--accent3)', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.85rem', display: 'inline-block' }}>Learn more →</span>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
        <Link href="/services" style={{
          border: '1px solid var(--border)', color: 'var(--text)', padding: '0.7rem 1.7rem',
          borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none',
        }}>View All Services</Link>
      </div>
    </section>
  )
}
