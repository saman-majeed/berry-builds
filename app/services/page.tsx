import { getDb } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services – BerryBuilds',
  description: 'Full-stack digital solutions from web development to AI.',
}

export default async function ServicesPage() {
  const db = getDb()
  const allServices = db.prepare("SELECT * FROM services WHERE status='active' ORDER BY category, name").all() as any[]
  const stats = {
    projects: (db.prepare("SELECT value FROM settings WHERE key='stats-projects'").get() as any)?.value || '50+',
    clients:  (db.prepare("SELECT value FROM settings WHERE key='stats-clients'").get() as any)?.value || '40+',
    satisfaction: (db.prepare("SELECT value FROM settings WHERE key='stats-satisfaction'").get() as any)?.value || '99%',
    experience:   (db.prepare("SELECT value FROM settings WHERE key='stats-experience'").get() as any)?.value || '5+',
  }

  const grouped = allServices.reduce((acc: Record<string, any[]>, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div style={{ padding: '60px 5% 80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '50px 0 40px' }}>
        <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Full-Stack Digital Solutions
        </span>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: 'white', margin: '0.6rem 0 1rem', letterSpacing: '-0.025em' }}>
          Services That Drive Digital Transformation
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: '580px', margin: '0 auto 2rem' }}>
          From concept to deployment — end-to-end solutions that help businesses innovate and scale.
        </p>
        {/* Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '13px', overflow: 'hidden', maxWidth: '700px', margin: '0 auto' }}>
          {[['Projects','stats-projects',stats.projects],['Clients','stats-clients',stats.clients],['Satisfaction','stats-satisfaction',stats.satisfaction],['Experience','stats-experience',stats.experience]].map(([label,,val],i) => (
            <div key={label} style={{ flex: '1 1 140px', textAlign: 'center', padding: '1.4rem 1rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div className="stat-num">{val}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.74rem', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Categories */}
      {Object.entries(grouped).map(([cat, services]) => (
        <div key={cat} style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', color: 'white', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            {cat}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.1rem' }}>
            {services.map((s: any) => (
              <div key={s.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.7rem' }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', color: 'white', marginBottom: '0.55rem' }}>
                  {s.icon} {s.name}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>{s.description || s.shortDesc}</p>
                {s.deliverables && (
                  <ul style={{ listStyle: 'none', marginBottom: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
                    {s.deliverables.split('\n').filter(Boolean).map((d: string) => (
                      <li key={d} style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '0.9rem', position: 'relative' }}>
                        <span style={{ color: 'var(--accent3)', position: 'absolute', left: 0 }}>→</span>
                        {d.trim()}
                      </li>
                    ))}
                  </ul>
                )}
                {s.stack && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {s.stack.split(',').map((t: string) => (
                      <span key={t} style={{ background: 'rgba(109,40,217,.12)', border: '1px solid rgba(109,40,217,.25)', color: 'var(--accent3)', padding: '0.14rem 0.55rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 500 }}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div style={{ textAlign: 'center', background: 'rgba(109,40,217,.08)', border: '1px solid rgba(109,40,217,.2)', borderRadius: '13px', padding: '2.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1.7rem', marginBottom: '0.7rem' }}>Ready to Start Your Project?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Let's discuss how we can bring your ideas to life.</p>
        <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ background: 'var(--accent)', color: 'white', padding: '0.7rem 1.7rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Get a Free Quote</Link>
          <Link href="/projects" style={{ border: '1px solid var(--border)', color: 'var(--text)', padding: '0.7rem 1.7rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}>View Our Work</Link>
        </div>
      </div>
    </div>
  )
}
