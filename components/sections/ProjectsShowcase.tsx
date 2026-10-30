'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PROJECTS, Project } from '@/data/projects'

interface ProjectsShowcaseProps {
  mode?: 'featured' | 'full'
  title?: string
  subtitle?: string
}

export default function ProjectsShowcase({
  mode = 'full',
  title = 'Selected Projects',
  subtitle = 'An interactive gallery of high-performance web applications and mobile engineering.',
}: ProjectsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Web' | 'Mobile'>('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Filter projects if on full page; featured mode highlights all 7 smoothly
  const filteredProjects: Project[] =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory)

  const total = filteredProjects.length

  // Ensure currentIndex stays within bounds when category changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrentIndex((index + total) % total)
      setTimeout(() => setIsAnimating(false), 450)
    },
    [isAnimating, total]
  )

  const prev = useCallback(() => goToSlide(currentIndex - 1), [goToSlide, currentIndex])
  const next = useCallback(() => goToSlide(currentIndex + 1), [goToSlide, currentIndex])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    },
    [prev, next]
  )

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchStartY.current = e.targetTouches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const diffX = touchStartX.current - touchEndX
    const diffY = touchStartY.current - touchEndY

    // Only swipe if horizontal drag is significantly greater than vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        next()
      } else {
        prev()
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const activeProject = filteredProjects[currentIndex] || filteredProjects[0]

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive projects showcase"
      aria-roledescription="carousel"
      className="outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 select-none w-full"
    >
      {/* ── Header Controls Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          {mode === 'full' && (
            <div className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase mb-1.5">
              Case Studies &amp; Deployments
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Filter Pills (for Full Mode) & Arrow Navigation */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {mode === 'full' && (
            <div className="flex items-center p-1 rounded-full border border-border/80 bg-background/90 shadow-2xs">
              {(['All', 'Web', 'Mobile'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${selectedCategory === cat
                      ? 'bg-foreground text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-foreground hover:text-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/80 text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-foreground hover:text-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Showcase Sliding Stage ───────────────────────────────── */}
      {/*
        Outer card: overflow-hidden provides the hard clip boundary.
        Reduced padding (p-4 sm:p-5 lg:p-6) trims excess vertical space.
      */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-lg">

        {/*
          Viewport wrapper: overflow-hidden guarantees inactive slides cannot
          visually overflow into the active slide's presentation area, even
          if child content extends beyond the slide boundary.
        */}
        <div className="w-full overflow-hidden">
          {/* Sliding Track — translateX moves by 100% increments of this container */}
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {filteredProjects.map((project, idx) => {
              const isActive = idx === currentIndex
              return (
                <div
                  key={project.id}
                  aria-hidden={!isActive}
                  className="w-full shrink-0 min-w-full"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">

                    {/* Visual Display Frame (Desktop: 7 cols, Mobile: 12 cols) */}
                    <div className="lg:col-span-7 flex justify-center items-start">
                      {project.aspectRatio === 'mobile' ? (
                        /* ── Elegant Mobile Phone Bezel Frame ── */
                        <div className="relative mx-auto w-[250px] sm:w-[280px] md:w-[300px] aspect-[9/19.2] rounded-[44px] p-3 bg-neutral-900 border-[5px] border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition-transform duration-500">
                          {/* Dynamic Island / Camera Notch */}
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-24 bg-neutral-950 rounded-full z-20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-neutral-900 mr-2" />
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-950/70" />
                          </div>

                          {/* Screen Viewport with genuine screenshot */}
                          <div className="relative h-full w-full rounded-[34px] overflow-hidden bg-neutral-950">
                            <Image
                              src={project.image}
                              alt={`${project.title} live interface preview`}
                              fill
                              sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                              className="object-cover object-top transition-transform duration-700 hover:scale-105"
                              priority={idx === 0}
                            />
                          </div>
                        </div>
                      ) : (
                        /* ── Refined Desktop Browser Frame ── */
                        /*
                          bg-neutral-950 on outer frame is intentional (the macOS window chrome).
                          The browser body has NO background so the image sits flush —
                          width={1440} height={900} with h-auto renders the natural 16:9 ratio
                          and no black letterbox appears beneath the screenshot.
                        */
                        <div className="w-full rounded-2xl overflow-hidden border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform duration-500">
                          {/* macOS-style Top Window Chrome */}
                          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block" />
                              <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block" />
                              <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-800/80 border border-white/5 text-[11px] font-mono text-neutral-400 max-w-[260px] truncate">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-400">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <span className="truncate">{project.liveUrl.replace('https://', '')}</span>
                            </div>
                            <div className="w-12" /> {/* Spacer */}
                          </div>

                          {/* Browser Body — natural 16:9 aspect; no bg so image fills flush to bottom edge */}
                          <div className="relative w-full overflow-hidden leading-[0]">
                            <Image
                              src={project.image}
                              alt={`${project.title} desktop web application hero`}
                              width={1440}
                              height={900}
                              sizes="(max-width: 1024px) 100vw, 720px"
                              className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]"
                              priority={idx === 0}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Details Panel (Desktop: 5 cols, Mobile: 12 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Category Badge & Slide Count */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-foreground/5 text-foreground border border-border/70">
                            <span className={`h-1.5 w-1.5 rounded-full ${project.category === 'Web' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                            {project.category} Application
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            0{idx + 1}&nbsp;/&nbsp;0{total}
                          </span>
                        </div>

                        {/* Subtitle / Focus */}
                        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                          {project.subtitle}
                        </div>

                        {/* Project Title */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-muted-foreground leading-relaxed mb-3">
                          {project.description}
                        </p>

                        {/* Tech Stack Badges */}
                        <div className="mb-3">
                          <div className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground/80 mb-2">
                            Technologies &amp; Infrastructure
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs font-medium px-3 py-1 rounded-lg bg-card border border-border/80 text-foreground shadow-2xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions & Live Demo CTA */}
                      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-3">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-white shadow-sm transition-all hover:opacity-85 active:scale-95"
                          aria-label={`Open live application demo for ${project.title}`}
                        >
                          <span>Launch Live Demo</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>

                        {mode === 'featured' && (
                          <Link
                            href="/projects"
                            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-95"
                          >
                            <span>Explore All ({PROJECTS.length})</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Slide Progress Bar & Indicators ───────────────────────── */}
        <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-border/40">
          {/* Quick thumbnails / dots */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {filteredProjects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${p.title}`}
                className={`group relative flex items-center transition-all ${currentIndex === idx ? 'w-10 sm:w-14' : 'w-2 sm:w-3'
                  } h-2 rounded-full bg-foreground/20 hover:bg-foreground/40`}
              >
                {currentIndex === idx && (
                  <span className="absolute inset-0 rounded-full bg-foreground transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Current track indicator text */}
          <div className="text-xs font-mono text-muted-foreground shrink-0">
            Slide {currentIndex + 1} of {total}
          </div>
        </div>

      </div>
    </div>
  )
}
