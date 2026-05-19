'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <nav
        className={[
          'fixed left-0 right-0 top-0 z-[500] flex h-[66px] items-center justify-between px-[5%]',
          'border-b backdrop-blur-xl transition-[background,box-shadow,border-color] duration-300 ease-out',
          scrolled
            ? 'border-border/90 bg-[rgba(6,6,11,0.88)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
            : 'border-border/60 bg-[rgba(6,6,11,0.72)]',
        ].join(' ')}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline outline-none ring-accent2/40 transition-opacity hover:opacity-90 focus-visible:ring-2"
        >
          <span className="relative">
            <Image
              src="/logo.png"
              alt="BerryBuilds Logo"
              width={38}
              height={38}
              className="rounded-full shadow-[0_0_24px_rgba(124,58,237,0.25)]"
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-[#e879f9]/15 ring-1 ring-inset ring-white/10"
              aria-hidden
            />
          </span>
          <span className="font-syne text-xl font-bold tracking-tight text-white">
            Berry<span className="text-accent3">Builds</span>
          </span>
        </Link>

        <ul className="hidden list-none items-center gap-8 sm:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={[
                    'group relative pb-0.5 text-sm font-medium no-underline transition-colors duration-200',
                    active ? 'text-white' : 'text-muted hover:text-text',
                  ].join(' ')}
                >
                  {l.label}
                  <span
                    className={[
                      'absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-accent2 to-[#e879f9] transition-[width] duration-300 ease-out',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    ].join(' ')}
                    aria-hidden
                  />
                </Link>
              </li>
            )
          })}
          <li>
            <Link
              href="/admin"
              className="text-sm font-semibold text-accent3 no-underline transition-colors hover:text-white"
            >
              Admin ⚙️
            </Link>
          </li>
          <li>
            <Link href="/contact" className="btn-primary text-sm shadow-lg">
              Get Started
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer rounded-lg border border-border/80 bg-surface2/50 p-2 sm:hidden"
        >
          <span className="flex h-[18px] w-6 flex-col justify-center gap-[5px]">
            <span
              className={[
                'block h-0.5 w-full origin-center rounded-full bg-text transition-transform duration-200',
                open ? 'translate-y-[7px] rotate-45' : '',
              ].join(' ')}
            />
            <span className={[open ? 'scale-0 opacity-0' : '', 'block h-0.5 w-full rounded-full bg-text transition duration-200'].join(' ')} />
            <span
              className={[
                'block h-0.5 w-full origin-center rounded-full bg-text transition-transform duration-200',
                open ? '-translate-y-[7px] -rotate-45' : '',
              ].join(' ')}
            />
          </span>
        </button>
      </nav>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 top-[66px] z-[498] bg-black/45 sm:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={[
          'fixed left-0 right-0 top-[66px] z-[499] border-b bg-surface/95 backdrop-blur-lg transition-[max-height,opacity] duration-300 ease-out sm:hidden',
          open ? 'max-h-[340px] border-border opacity-100' : 'max-h-0 border-transparent opacity-0',
          'overflow-hidden',
        ].join(' ')}
      >
        <ul className="list-none px-[5%] pb-5 pt-1">
          {[...links, { href: '/admin', label: 'Admin ⚙️' as const }].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-3 text-muted no-underline transition-colors hover:text-accent3"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary block text-center shadow-md">
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
