import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact – BerryBuilds',
  description: 'Get in touch with BerryBuilds to start your project.',
}

export default function ContactPage() {
  return (
    <div style={{ padding: '60px 5% 80px' }}>
      <div style={{ textAlign: 'center', padding: '50px 0 40px' }}>
        <span style={{ color: 'var(--accent3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get In Touch</span>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', margin: '0.6rem 0 1rem', letterSpacing: '-0.025em' }}>
          Let's Build Something Amazing Together
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: '520px', margin: '0 auto' }}>
          Fill out the form and we'll get back to you within 24 hours.
        </p>
      </div>
      <ContactForm />
    </div>
  )
}
