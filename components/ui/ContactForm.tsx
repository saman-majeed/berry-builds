'use client'
import { useState } from 'react'

const services = ['Web Development','Mobile App Development','AI & Data Science','Agentic AI Development','UI/UX Design','Video Production','Digital Marketing & SEO','Cloud & Infrastructure','Custom Software Development','Other']
const budgets = ['Under $5,000','$5,000 - $10,000','$10,000 - $25,000','$25,000 - $50,000','$50,000 - $100,000','Over $100,000','Not sure yet']

export default function ContactForm() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', company:'', service:'', budget:'', details:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.firstName || !form.email || !form.service || !form.details) { setError('Please fill in all required fields.'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Please enter a valid email address.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setSuccess(true); setForm({ firstName:'', lastName:'', email:'', phone:'', company:'', service:'', budget:'', details:'' }) }
      else { const d = await res.json(); setError(d.error || 'Something went wrong.') }
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const inp = { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '7px', padding: '0.65rem 0.9rem', color: 'var(--text)', fontSize: '0.88rem', width: '100%', outline: 'none', fontFamily: 'DM Sans, sans-serif' } as React.CSSProperties
  const lbl = { display: 'block', color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem' } as React.CSSProperties

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '13px', padding: '2rem' }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'white', marginBottom: '0.5rem' }}>Message Sent!</h3>
            <p style={{ color: 'var(--muted)' }}>We'll get back to you within 24 hours.</p>
            <button onClick={() => setSuccess(false)} style={{ marginTop: '1.5rem', background: 'var(--accent)', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Send Another</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={lbl}>First Name *</label><input style={inp} placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
              <div><label style={lbl}>Last Name *</label><input style={inp} placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div><label style={lbl}>Email *</label><input style={inp} type="email" placeholder="john@company.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
              <div><label style={lbl}>Phone</label><input style={inp} placeholder="+1 234 567 8900" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            </div>
            <div style={{ marginTop: '1rem' }}><label style={lbl}>Company / Organization</label><input style={inp} placeholder="Your Company" value={form.company} onChange={e => set('company', e.target.value)} /></div>
            <div style={{ marginTop: '1rem' }}>
              <label style={lbl}>Service Interested In *</label>
              <select style={{ ...inp }} value={form.service} onChange={e => set('service', e.target.value)}>
                <option value="">Select a service</option>
                {services.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={lbl}>Budget Range</label>
              <select style={{ ...inp }} value={form.budget} onChange={e => set('budget', e.target.value)}>
                <option value="">Select budget range</option>
                {budgets.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '1rem' }}><label style={lbl}>Project Details *</label><textarea style={{ ...inp, minHeight: '120px', resize: 'vertical' }} placeholder="Tell us about your project, goals, timeline..." value={form.details} onChange={e => set('details', e.target.value)} /></div>
            {error && <p style={{ color: '#f87171', fontSize: '0.83rem', marginTop: '0.8rem' }}>{error}</p>}
            <button onClick={submit} disabled={loading} style={{ width: '100%', marginTop: '1rem', background: loading ? 'var(--border2)' : 'var(--accent)', color: 'white', border: 'none', padding: '0.78rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '11px', padding: '1.4rem' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '0.95rem', marginBottom: '1rem' }}>Contact Information</h3>
          {[['📧','Email','solutions@berrybuilds.com'],['📞','Phone','+92 333 4344291'],['📍','Address','Main College Road, Johar Town Lahore, Pakistan'],['🕐','Business Hours','Mon - Fri: 9:00 AM - 7:00 PM (PKT)']].map(([ico,lbl,val]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '34px', height: '34px', background: 'rgba(109,40,217,.14)', border: '1px solid rgba(109,40,217,.28)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', flexShrink: 0 }}>{ico}</div>
              <div><div style={{ color: 'var(--text)', fontSize: '0.83rem', fontWeight: 600 }}>{lbl}</div><div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{val}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(109,40,217,.08)', border: '1px solid rgba(109,40,217,.22)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '0.9rem', marginBottom: '0.4rem' }}>⚡ Quick Response Guarantee</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>We respond to all inquiries within 24 hours during business days.</p>
        </div>
      </div>
    </div>
  )
}
