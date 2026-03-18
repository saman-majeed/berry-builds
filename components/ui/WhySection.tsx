import Link from 'next/link'

const techStack = ['Next.js','React','TypeScript','Node.js','Python','TensorFlow','AWS','MongoDB','PostgreSQL','Docker','LangChain','Claude API']

export function WhySection() {
  return (
    <section style={{ background: 'var(--surface)', padding: '80px 5%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
        <div>
          <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Why Choose Us</span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.7rem,3vw,2.5rem)', color: 'white', margin: '0.5rem 0 0.8rem' }}>Technical Excellence Meets Business Understanding</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>We combine deep expertise with clear communication to deliver solutions that make a real impact.</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['End-to-end development from concept to deployment','Modern tech stack with scalable architecture','Dedicated team with clear communication','Agile methodology with iterative delivery','Post-launch support and maintenance'].map(item => (
              <li key={item} style={{ display: 'flex', gap: '0.7rem', color: 'var(--text)', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--accent3)', fontWeight: 800, flexShrink: 0 }}>✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Stack</span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', color: 'white', margin: '0.5rem 0 0.8rem' }}>Technologies We Use</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Battle-tested tools chosen for performance and scalability.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {techStack.map(t => (
              <span key={t} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '0.25rem 0.7rem',
                borderRadius: '5px', fontSize: '0.76rem', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CtaSection() {
  return (
    <section style={{
      padding: '100px 5%', textAlign: 'center',
      background: 'radial-gradient(ellipse 65% 75% at 50%, rgba(109,40,217,.1), transparent 70%)',
      borderTop: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get Started</span>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', color: 'white', margin: '0.7rem 0 1rem' }}>Ready to Build Something Amazing?</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 2rem' }}>Let's discuss your project and create a solution that drives real results.</p>
      <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/contact" style={{ background: 'var(--accent)', color: 'white', padding: '0.7rem 1.7rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 20px var(--glow)' }}>Get a Free Consultation</Link>
        <Link href="/services" style={{ border: '1px solid var(--border)', color: 'var(--text)', padding: '0.7rem 1.7rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}>Explore Services</Link>
      </div>
    </section>
  )
}
