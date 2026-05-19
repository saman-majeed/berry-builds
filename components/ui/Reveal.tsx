'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delayMs?: number
}

export default function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal-base ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : undefined }}
    >
      {children}
    </div>
  )
}
