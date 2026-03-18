import Link from 'next/link'
import Image from 'next/image' // Added for the logo
import { usePathname } from 'next/navigation'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      padding: '2rem 5%', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
    }}>
      {/* LOGO SECTION UPDATED */}
      <Link href="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700,
        fontSize: '1.1rem',
        color: 'white',
        textDecoration: 'none'
      }}>
        <Image
          src="/logo.png" // Ensure this is in your 'public' folder
          alt="BerryBuilds Logo"
          width={28}
          height={28}
          style={{ borderRadius: '50%' }}
        />
        <span>
          Berry<span style={{ color: 'var(--accent3)' }}>Builds</span>
        </span>
      </Link>

      <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { href: '/projects', label: 'Projects' },
          { href: '/services', label: 'Services' },
          { href: '/contact', label: 'Contact' },
          { href: '/admin', label: 'Admin' },
        ].map(l => (
          <li key={l.href}>
            <Link href={l.href} style={{ color: 'var(--muted)', fontSize: '0.82rem', textDecoration: 'none' }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <span style={{ color: 'var(--muted)', fontSize: '0.76rem' }}>
        © {new Date().getFullYear()} BerryBuilds. All rights reserved.
      </span>
    </footer>
  )
}