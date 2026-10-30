'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isLinkActive = (href: string) => {
    if (href === '/#about') {
      return pathname === '/about'
    }
    return pathname === href
  }

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/50 bg-background/70 backdrop-blur-md'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-14 max-w-[var(--content-width)] items-center justify-between px-4">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          WA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                'transition-colors duration-200',
                isLinkActive(href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex sm:hidden flex-col gap-1.5 p-2 text-foreground"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span
            className={[
              'block h-px w-5 bg-current transition-all duration-200',
              menuOpen ? 'translate-y-[5px] rotate-45' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block h-px w-5 bg-current transition-all duration-200',
              menuOpen ? 'opacity-0' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block h-px w-5 bg-current transition-all duration-200',
              menuOpen ? '-translate-y-[9px] -rotate-45' : '',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-border/50 bg-background/95 px-6 py-4 text-sm font-medium sm:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                'py-3 transition-colors duration-200',
                isLinkActive(href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
