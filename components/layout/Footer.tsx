import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'

export default function Footer() {
  const linkItems = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ]

  return (
    <footer className="border-t border-border bg-surface px-[5%] py-12">
      <Reveal>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 sm:flex-row sm:flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-syne text-lg font-bold text-white no-underline transition-opacity hover:opacity-90"
          >
            <Image src="/logo.png" alt="BerryBuilds Logo" width={28} height={28} className="rounded-full" />
            <span>
              Berry<span className="text-accent3">Builds</span>
            </span>
          </Link>

          <ul className="flex list-none flex-wrap justify-center gap-x-8 gap-y-3">
            {linkItems.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.82rem] text-muted no-underline transition-colors hover:text-accent3"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-center text-[0.76rem] text-muted sm:text-right">
            © {new Date().getFullYear()} BerryBuilds. All rights reserved.
          </p>
        </div>
      </Reveal>
    </footer>
  )
}
