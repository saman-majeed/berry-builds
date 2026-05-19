import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

const thumbColors = [
  'linear-gradient(135deg,#1e3a5f,#0f2038)',
  'linear-gradient(135deg,#1a3828,#0d1f16)',
  'linear-gradient(135deg,#2d1b5e,#180f38)',
]

export default function ProjectsPreview({ projects }: { projects: any[] }) {
  return (
    <section className="relative px-[5%] py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-[10%] h-72 w-72 rounded-full bg-accent/15 blur-[100px]"
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <Reveal className="mb-14 inline-block">
          <span className="section-label">Our Work</span>
          <h2 className="mt-6 font-syne text-[clamp(1.7rem,3.5vw,2.7rem)] font-bold tracking-tight text-white">
            Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] leading-relaxed text-muted">
            Real-world solutions we&apos;ve built for clients across industries.
          </p>
        </Reveal>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any, i: number) => (
            <Reveal key={p.id} delayMs={Math.min(i * 80, 280)}>
              <Link
                href="/projects"
                className="hover-lift-card group block overflow-hidden rounded-2xl border border-border bg-surface text-left no-underline transition-shadow duration-300"
              >
                <div className="relative h-[170px] overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute inset-0 z-[1] bg-gradient-to-t from-surface via-transparent to-transparent opacity-70"
                  />
                  <span className="absolute left-4 top-4 z-[2] rounded-md border border-white/15 bg-black/55 px-2 py-1 text-[0.64rem] font-semibold uppercase tracking-wide text-accent3 backdrop-blur-sm">
                    {p.tag || p.category}
                  </span>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-[transform] duration-500 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center bg-black/20 text-[3.5rem]"
                      style={{ backgroundImage: thumbColors[i % 3] }}
                    >
                      <span className="drop-shadow-[0_0_20px_rgba(0,0,0,.5)]">{p.emoji || '🌐'}</span>
                    </div>
                  )}
                </div>
                <div className="relative z-[1] p-6">
                  <h3 className="font-syne text-[1rem] font-bold text-white transition-colors duration-200 group-hover:text-accent3">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[0.81rem] leading-relaxed text-muted line-clamp-2">{p.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 inline-block">
          <Link href="/projects" className="btn-secondary inline-flex">
            View All Projects
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
