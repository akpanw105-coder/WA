'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [year, setYear] = useState<number | null>(null)
  useEffect(() => { setYear(new Date().getFullYear()) }, [])

  return (
    <footer className="border-t border-border/60 py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-[var(--content-width)] px-4 flex items-center justify-between flex-wrap gap-4">
        <p>© {year ?? '——'} Wisdom Akpan. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/akpanw105-coder"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://x.com/akpan_wisd8378"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) profile"
            className="transition-colors hover:text-foreground"
          >
            X
          </a>
          <a
            href="mailto:akpanw284@gmail.com"
            aria-label="Send email"
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

