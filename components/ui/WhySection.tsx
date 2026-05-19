import Reveal from '@/components/ui/Reveal'

const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'TensorFlow',
  'AWS',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'LangChain',
  'Claude API',
]

const bullets = [
  'End-to-end development from concept to deployment',
  'Modern tech stack with scalable architecture',
  'Dedicated team with clear communication',
  'Agile methodology with iterative delivery',
  'Post-launch support and maintenance',
]

export default function WhySection() {
  return (
    <section className="relative overflow-hidden bg-surface px-[5%] py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[320px] w-[320px] rounded-full bg-gradient-to-bl from-accent/15 to-transparent blur-[100px]"
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-14 md:grid-cols-2 md:gap-16 lg:gap-24">
        <Reveal>
          <div>
            <span className="section-label">Why Choose Us</span>
            <h2 className="mt-6 font-syne text-[clamp(1.65rem,3vw,2.5rem)] font-bold tracking-tight text-white">
              Technical Excellence Meets Business Understanding
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              We combine deep expertise with clear communication to deliver solutions that make a real impact.
            </p>
            <ul className="mt-10 flex list-none flex-col gap-4">
              {bullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 rounded-xl border border-border bg-surface2/70 px-4 py-4 text-[0.92rem] text-text backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-accent2/35 hover:shadow-[0_0_32px_rgba(124,58,237,0.08)]"
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-sm font-bold text-accent2 ring-1 ring-accent2/20">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-surface2 to-surface p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04] md:p-10">
            <span className="section-label">Our Stack</span>
            <h3 className="mt-6 font-syne text-[1.6rem] font-bold tracking-tight text-white md:text-[1.75rem]">
              Technologies We Use
            </h3>
            <p className="mt-3 text-muted">Battle-tested tools chosen for performance and scalability.</p>
            <div className="mt-10 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border bg-bg/80 px-3 py-1.5 text-[0.76rem] font-medium text-muted transition-[transform,border-color,color,background] duration-200 hover:-translate-y-0.5 hover:border-accent2/40 hover:bg-accent/10 hover:text-accent3"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
