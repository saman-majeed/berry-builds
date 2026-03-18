'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image' // Added for the logo
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ]

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: '66px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%',
        background: 'rgba(8,8,14,.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* LOGO SECTION UPDATED */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <Image
            src="/logo.png" // Ensure this is in your 'public' folder
            alt="BerryBuilds Logo"
            width={38}
            height={38}
            style={{ borderRadius: '50%' }}
          />
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'white',
            letterSpacing: '-0.02em'
          }}>
            Berry<span style={{ color: 'var(--accent3)' }}>Builds</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: '1.8rem' }} className="hidden-mobile">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{
                color: pathname === l.href ? 'white' : 'var(--muted)',
                fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                borderBottom: pathname === l.href ? '2px solid var(--accent3)' : '2px solid transparent',
                paddingBottom: '2px', transition: 'color .2s',
              }}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent3)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>Admin ⚙️</Link>
          </li>
          <li>
            <Link href="/contact" style={{
              background: 'var(--accent)', color: 'white', padding: '0.4rem 1.1rem',
              borderRadius: '7px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
              boxShadow: '0 0 16px var(--glow)',
            }}>Get Started</Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="show-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', display: 'block' }} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: '66px', left: 0, right: 0,
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          zIndex: 499, padding: '1rem 5%',
        }}>
          <ul style={{ listStyle: 'none' }}>
            {[...links, { href: '/admin', label: 'Admin ⚙️' }].map(l => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} style={{
                  display: 'block', padding: '0.75rem 0', color: 'var(--muted)',
                  borderBottom: '1px solid var(--border)', textDecoration: 'none',
                }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}