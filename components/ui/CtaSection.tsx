import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border px-[5%] py-28 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_75%_at_50%_40%,rgba(124,58,237,0.14),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#e879f9]/10 blur-[90px]"
      />
      <Reveal className="relative z-[1] mx-auto max-w-2xl">
        <span className="section-label mb-6">Get Started</span>
        <h2 className="font-syne text-[clamp(1.85rem,3.5vw,2.85rem)] font-bold tracking-tight text-white">
          Ready to Build Something Amazing?
        </h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
          Let&apos;s discuss your project and create a solution that drives real results.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary">
            Get a Free Consultation
          </Link>
          <Link href="/services" className="btn-secondary">
            Explore Services
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
