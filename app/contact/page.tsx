import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact – BerryBuilds',
  description: 'Get in touch with BerryBuilds to start your project.',
}

export default function ContactPage() {
  return (
    <div className="relative px-[5%] pb-24 pt-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-[90%] max-w-3xl -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/20 to-transparent blur-3xl"
      />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <span className="section-label">Get In Touch</span>
        <h1 className="mt-8 font-syne text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-white">
          Let&apos;s Build Something Amazing Together
        </h1>
        <p className="mx-auto mt-5 max-w-[520px] leading-relaxed text-muted">
          Fill out the form and we&apos;ll get back to you within 24 hours.
        </p>
      </div>
      <div className="relative mx-auto mt-12 max-w-[1100px]">
        <ContactForm />
      </div>
    </div>
  )
}
