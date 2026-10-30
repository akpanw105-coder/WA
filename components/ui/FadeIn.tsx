'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  /** Delay in ms before animation starts */
  delay?: number
}

/**
 * FadeIn
 *
 * Wraps children with a fade-in-up reveal triggered by IntersectionObserver.
 * Falls back gracefully when JS is disabled or reduced-motion is active.
 */
export default function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  const ref     = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:           visible ? 1 : 0,
        transform:         visible ? 'translateY(0)' : 'translateY(10px)',
        transition:        `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

