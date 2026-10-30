'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { PROJECTS, Project } from '@/data/projects'

export default function ProjectsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = PROJECTS.length
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const activeProject: Project = PROJECTS[currentIndex]

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? total - 1 : prevIndex - 1))
  }, [total])

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === total - 1 ? 0 : prevIndex + 1))
  }, [total])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    },
    [prev, next]
  )

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isSwipe = Math.abs(distance) > 50
    if (isSwipe) {
      if (distance > 0) {
        next() // swiped left
      } else {
        prev() // swiped right
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Projects carousel"
      aria-roledescription="carousel"
      className="outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded-2xl"
    >
      {/* Top Header & Navigation controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-foreground/5 text-muted-foreground border border-border/60">
            {activeProject.category} Project
          </span>
          <span className="text-sm font-mono text-muted-foreground">
            0{currentIndex + 1} / 0{total}
          </span>
        </div>

        {/* Previous / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground transition-all hover:bg-muted active:scale-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground transition-all hover:bg-muted active:scale-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Screenshot Display Viewport */}
          <div className="lg:col-span-7 flex justify-center items-center">
            {activeProject.aspectRatio === 'mobile' ? (
              /* Mobile Mockup Frame */
              <div className="relative mx-auto w-[240px] sm:w-[280px] aspect-[9/19] rounded-[36px] p-2.5 bg-neutral-900 shadow-xl border-4 border-neutral-800">
                {/* Speaker pill notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-20 bg-neutral-950 rounded-full z-20" />
                <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-neutral-950">
                  <Image
                    key={activeProject.id}
                    src={activeProject.image}
                    alt={`${activeProject.title} mobile interface screenshot`}
                    fill
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover object-top transition-opacity duration-300"
                    priority
                  />
                </div>
              </div>
            ) : (
              /* Desktop / Web Browser Frame */
              <div className="w-full rounded-xl overflow-hidden border border-border/80 bg-neutral-900 shadow-md">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-border/50">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-[11px] text-muted-foreground font-mono truncate">
                    {activeProject.liveUrl}
                  </span>
                </div>
                <div className="relative aspect-[16/10] w-full bg-neutral-950">
                  <Image
                    key={activeProject.id}
                    src={activeProject.image}
                    alt={`${activeProject.title} application screenshot`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover object-top transition-opacity duration-300"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Project Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                {activeProject.subtitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
                {activeProject.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                {activeProject.description}
              </p>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {activeProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-foreground/[0.04] text-foreground border border-border/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Link */}
            <div>
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-85 active:scale-95 shadow-xs"
                aria-label={`Open live demo for ${activeProject.title}`}
              >
                <span>Live Demo</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Slide Indicators Navigation Cue */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {PROJECTS.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${proj.title}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-foreground'
                : 'w-2 bg-foreground/20 hover:bg-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

