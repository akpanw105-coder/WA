'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

// Visual tuning constants for crisp, balanced prominence on light backgrounds
const MAX_DIST = 160
const LINE_ALPHA_MAX = 0.38      // clearly visible line connections
const PARTICLE_ALPHA = 0.65      // clearly visible nodes
const BASE_SPEED = 0.35          // smooth, calm drift speed

/**
 * NetworkCanvas
 *
 * Full-viewport animated particle-network canvas that floats over the 40px engineering grid.
 *
 * Key features:
 * - Dynamically scales particle count based on screen area (~1 particle per 14,000 px²).
 * - Multiplies canvas coordinate buffer by window.devicePixelRatio for retina/HiDPI sharpness.
 * - Respects prefers-reduced-motion by pausing the animation loop.
 * - pointer-events: none ensures zero interference with clicking, typing, or scrolling.
 */
export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let animId: number
    let width = 0
    let height = 0
    let dpr = 1
    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1))
      width = window.innerWidth
      height = window.innerHeight

      // Scale internal bitmap for sharp rendering
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)

      // CSS display size matches viewport
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }

    function init() {
      particles.length = 0
      // Responsive density: min 55 on mobile, ~100-130 on desktop/ultrawide
      const screenArea = width * height
      const targetCount = Math.max(55, Math.min(135, Math.floor(screenArea / 14000)))

      for (let i = 0; i < targetCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * BASE_SPEED,
          vy: (Math.random() - 0.5) * BASE_SPEED,
          radius: Math.random() > 0.8 ? 2.2 : 1.6, // subtle size variety
        })
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, width, height)

      // 1. Move and bounce particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) {
          p.x = 0
          p.vx *= -1
        } else if (p.x > width) {
          p.x = width
          p.vx *= -1
        }

        if (p.y < 0) {
          p.y = 0
          p.vy *= -1
        } else if (p.y > height) {
          p.y = height
          p.vy *= -1
        }
      }

      // 2. Draw connecting network lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DIST) {
            // Cubic falloff for smoother, more elegant fading
            const ratio = 1 - dist / MAX_DIST
            const alpha = LINE_ALPHA_MAX * (ratio * ratio)
            
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(24, 24, 27, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // 3. Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(24, 24, 27, ${PARTICLE_ALPHA})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      init()
    }

    resize()
    init()
    draw()

    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
    />
  )
}
