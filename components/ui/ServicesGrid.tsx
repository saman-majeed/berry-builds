import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function ServicesGrid({ services }: { services: any[] }) {
  return (
    <section className="relative overflow-hidden bg-surface px-[5%] py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[80%] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/10 to-transparent blur-3xl"
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <Reveal className="mb-14 inline-block">
          <span className="section-label">What We Do</span>
          <h2 className="mt-6 font-syne text-[clamp(1.7rem,3.5vw,2.7rem)] font-bold tracking-tight text-white">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted leading-relaxed">
            Comprehensive digital solutions tailored to your business needs.
          </p>
        </Reveal>

        <div className="grid gap-[1px] overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: any, i: number) => (
            <Reveal key={s.id} delayMs={Math.min(i * 60, 300)}>
              <Link
                href="/services"
                className="hover-lift-card group relative block border-0 bg-surface2 p-8 text-left no-underline"
              >
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:from-accent/[0.06] group-hover:to-transparent group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/35 bg-accent/10 text-xl transition-[transform,border-color,box-shadow] duration-300 group-hover:scale-[1.06] group-hover:border-accent2/50 group-hover:shadow-[0_0_24px_rgba(124,58,237,0.2)]">
                    {s.icon}
                  </div>
                  <h3 className="font-syne text-[0.97rem] font-bold text-white">{s.name}</h3>
                  <p className="mt-2 text-[0.83rem] leading-relaxed text-muted">{s.shortDesc}</p>
                  <span className="mt-6 inline-flex items-center text-[0.78rem] font-semibold text-accent2 transition-[gap,color] duration-300 group-hover:gap-2 group-hover:text-accent3">
                    Learn more →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 inline-block">
          <Link href="/services" className="btn-secondary inline-flex">
            View All Services
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
