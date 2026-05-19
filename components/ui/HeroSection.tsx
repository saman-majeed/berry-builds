import Link from 'next/link'

interface Stats {
  projects: string
  clients: string
  satisfaction: string
  experience: string
}

export default function HeroSection({ stats }: { stats: Stats }) {
  return (
    <section
      className="relative flex min-h-[calc(100vh-66px)] flex-col items-center justify-center overflow-hidden px-[5%] pb-16 pt-10 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(124,58,237,0.22),transparent_70%),radial-gradient(ellipse_40%_35%_at_85%_75%,rgba(232,121,249,0.12),transparent)]"
      />
      <div className="hero-orb left-[-10%] top-[15%] h-[min(45vw,420px)] w-[min(45vw,420px)] bg-accent" />
      <div className="hero-orb right-[-5%] top-[40%] h-[min(38vw,340px)] w-[min(38vw,340px)] bg-[#e879f9]" />
      <div className="hero-orb bottom-[-10%] left-[30%] h-[min(35vw,300px)] w-[min(35vw,300px)] bg-sky-500/40" />
      <div className="hero-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative z-[1] flex max-w-[880px] flex-col items-center">
        <div
          className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-accent3 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
          style={{ animationDelay: '0s' }}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent2 shadow-[0_0_10px_#a78bfa]" />
          Software Development &amp; AI Solutions
        </div>

        <h1
          className="animate-fade-up font-syne text-[clamp(2.35rem,5.5vw,4.85rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
          style={{ animationDelay: '0.08s' }}
        >
          We Build Digital Products
          <br />
          <span className="grad-text">That Scale</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-[540px] text-[1.05rem] leading-relaxed text-muted"
          style={{ animationDelay: '0.16s' }}
        >
          From cutting-edge web applications to intelligent AI systems, we help businesses transform their ideas into
          powerful digital solutions.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.22s' }}
        >
          <Link href="/contact" className="btn-primary">
            Start Your Project
          </Link>
          <Link href="/projects" className="btn-secondary">
            View Our Work →
          </Link>
        </div>

        <div
          className="animate-fade-up mt-20 w-full max-w-[720px] overflow-hidden rounded-2xl border border-border shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.05]"
          style={{ animationDelay: '0.28s' }}
        >
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { value: stats.projects, label: 'Projects Delivered' },
              { value: stats.clients, label: 'Happy Clients' },
              { value: stats.satisfaction, label: 'Client Satisfaction' },
              { value: stats.experience, label: 'Years Experience' },
            ].map((s) => (
              <div
                key={s.label}
                className="group bg-surface/95 px-4 py-6 text-center transition-colors duration-300 hover:bg-surface3/95"
              >
                <div className="stat-num transition-transform duration-300 group-hover:scale-[1.02]">{s.value}</div>
                <div className="mt-1 text-[0.74rem] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="scroll-hint" aria-hidden>
          Scroll to explore
        </p>
      </div>
    </section>
  )
}
