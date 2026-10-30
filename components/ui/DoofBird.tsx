'use client'

import { useEffect, useRef } from 'react'

/**
 * DoofBird: Playful, interactive cursor-following bird companion.
 *
 * Characteristics:
 * - Follows the user's cursor / touch smoothly with easing (spring/lerp).
 * - Rotates and tilts naturally in its direction of travel.
 * - Flaps its wings when moving, settles into a gentle bob/idle when resting.
 * - Eyes playfully look toward the cursor.
 * - Floats in a top-layer fixed overlay with pointer-events: none so it NEVER
 *   obstructs clicks, text selections, or mobile scrolling.
 * - Automatically respects prefers-reduced-motion.
 */
export default function DoofBird() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const leftWingRef = useRef<SVGPathElement | null>(null)
  const rightWingRef = useRef<SVGPathElement | null>(null)
  const pupilLeftRef = useRef<SVGCircleElement | null>(null)
  const pupilRightRef = useRef<SVGCircleElement | null>(null)
  const feetRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const container = containerRef.current
    if (!container) return

    // Position state
    // Initial spawn: top right corner area or slightly offscreen
    let currentX = window.innerWidth * 0.8
    let currentY = 120
    let targetX = currentX
    let targetY = currentY
    let prevX = currentX
    let prevY = currentY
    let velocityX = 0
    let velocityY = 0

    let currentAngle = 0
    let currentScaleX = 1
    let wingPhase = 0
    let idlePhase = 0
    let isMoving = false
    let hasPointer = false
    let isTouchActive = false

    // Lerp smoothing factors
    const EASE = 0.065 // Smooth following delay
    const ROTATION_EASE = 0.12
    const MIN_DISTANCE = 16 // Deadzone to prevent micro-jitter

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      hasPointer = true
      isTouchActive = false
      targetX = e.clientX
      targetY = e.clientY
    }

    // Handle touch movement (passive to ensure fluid scrolling)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        hasPointer = true
        isTouchActive = true
        targetX = e.touches[0].clientX
        targetY = e.touches[0].clientY
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        hasPointer = true
        isTouchActive = true
        targetX = e.touches[0].clientX
        targetY = e.touches[0].clientY
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    let animId: number

    const render = () => {
      // Offset target slightly so bird flies beside/hovering near the pointer instead of covering it
      const offsetX = currentScaleX >= 0 ? -28 : 28
      const offsetY = isTouchActive ? -55 : -24 // Higher on touch so finger doesn't obscure it
      
      const desiredX = hasPointer ? targetX + offsetX : currentX
      const desiredY = hasPointer ? targetY + offsetY : currentY

      const dx = desiredX - currentX
      const dy = desiredY - currentY
      const dist = Math.hypot(dx, dy)

      if (dist > MIN_DISTANCE) {
        currentX += dx * EASE
        currentY += dy * EASE
        isMoving = true
      } else {
        isMoving = false
      }

      velocityX = currentX - prevX
      velocityY = currentY - prevY
      prevX = currentX
      prevY = currentY

      const speed = Math.hypot(velocityX, velocityY)

      // Turn/flip bird horizontally towards movement direction
      if (Math.abs(velocityX) > 0.4) {
        currentScaleX = velocityX >= 0 ? 1 : -1
      }

      // Calculate banking / tilt angle based on velocity
      let targetAngle = 0
      if (speed > 0.5) {
        // Natural tilt in degrees (-20 to +20)
        targetAngle = Math.max(-25, Math.min(25, (velocityY / (speed + 0.1)) * 18 * currentScaleX))
      } else {
        // Idle gentle float tilt
        idlePhase += 0.04
        targetAngle = Math.sin(idlePhase) * 3
      }

      currentAngle += (targetAngle - currentAngle) * ROTATION_EASE

      // Wing flap animation
      if (speed > 0.8) {
        wingPhase += 0.35 + Math.min(speed * 0.05, 0.3)
      } else {
        // Gentle resting wing breathing
        wingPhase += 0.05
      }

      const wingFlap = Math.sin(wingPhase)
      const leftWingAngle = wingFlap * 28
      const rightWingAngle = -wingFlap * 28

      if (leftWingRef.current) {
        leftWingRef.current.style.transform = `rotate(${leftWingAngle}deg)`
      }
      if (rightWingRef.current) {
        rightWingRef.current.style.transform = `rotate(${rightWingAngle}deg)`
      }

      // Feet paddle animation when flying
      if (feetRef.current) {
        const feetOffset = speed > 1.2 ? Math.sin(wingPhase * 1.2) * 2 : 0
        feetRef.current.style.transform = `translateY(${feetOffset}px)`
      }

      // Eyes pupil tracking: look subtly toward the cursor
      if (pupilLeftRef.current && pupilRightRef.current) {
        const eyeDx = targetX - currentX
        const eyeDy = targetY - currentY
        const eyeDist = Math.hypot(eyeDx, eyeDy) || 1
        const maxOffset = 2.2
        const pX = (eyeDx / eyeDist) * maxOffset * currentScaleX
        const pY = (eyeDy / eyeDist) * maxOffset
        pupilLeftRef.current.style.transform = `translate(${pX}px, ${pY}px)`
        pupilRightRef.current.style.transform = `translate(${pX}px, ${pY}px)`
      }

      // Apply master transformation to the bird wrapper
      container.style.transform = `translate3d(${currentX - 24}px, ${currentY - 24}px, 0) scaleX(${currentScaleX}) rotate(${currentAngle}deg)`

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform select-none"
      style={{
        width: '48px',
        height: '48px',
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      {/*
        Doof Bird SVG Illustration:
        A lovable, slightly goofy, round bluebird with fluffy body,
        big expressive eyes, cute round crest feathers, orange beak,
        flapping wings, and tiny orange feet.
      */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)]"
      >
        {/* Feet / Talons */}
        <g ref={feetRef} className="transition-transform duration-75">
          {/* Left foot */}
          <path
            d="M17 41C17 43 15 44 14 44M17 41C18 43 18 44 19 44M17 41L17 45"
            stroke="#EA580C"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Right foot */}
          <path
            d="M27 41C27 43 25 44 24 44M27 41C28 43 28 44 29 44M27 41L27 45"
            stroke="#EA580C"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </g>

        {/* Tail feathers */}
        <path
          d="M7 26C4 28 3 32 5 35C8 34 11 32 12 30Z"
          fill="#0284C7"
          stroke="#0369A1"
          strokeWidth="1"
        />
        <path
          d="M8 23C4 24 2 28 4 31C7 30 10 28 11 26Z"
          fill="#38BDF8"
        />

        {/* Main Body (Plump round bird shape) */}
        <ellipse
          cx="24"
          cy="26"
          rx="15"
          ry="15"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1.5"
        />

        {/* Soft belly patch */}
        <path
          d="M15 28C15 36 21 40 27 40C33 40 37 36 36 30C32 30 26 27 21 24C17 25 15 27 15 28Z"
          fill="#E0F2FE"
          opacity="0.9"
        />

        {/* Cute Doof Crest / Head Tuft */}
        <path
          d="M21 11C20 6 25 5 26 9C27 6 32 7 30 11"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="23" cy="7.5" r="1.5" fill="#38BDF8" />
        <circle cx="28.5" cy="8.5" r="1.5" fill="#38BDF8" />

        {/* Left Wing (Back/Side, rotates when flapping) */}
        <path
          ref={leftWingRef}
          d="M11 25C9 28 11 34 16 33C17 31 17 27 14 24C12.5 24 11.5 24.5 11 25Z"
          fill="#0284C7"
          stroke="#0369A1"
          strokeWidth="1"
          style={{ transformOrigin: '15px 25px' }}
        />

        {/* Left Eye */}
        <circle cx="22" cy="20" r="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <circle ref={pupilLeftRef} cx="22.5" cy="20" r="2.2" fill="#0F172A">
          {/* Eye highlight */}
          <circle cx="23.2" cy="19.2" r="0.75" fill="#FFFFFF" />
        </circle>

        {/* Right Eye (Slightly larger doofy curious expression) */}
        <circle cx="31" cy="20" r="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <circle ref={pupilRightRef} cx="31.5" cy="20" r="2.4" fill="#0F172A">
          {/* Eye highlight */}
          <circle cx="32.4" cy="19" r="0.85" fill="#FFFFFF" />
        </circle>

        {/* Doof Beak (Adorable round-tipped orange beak) */}
        <path
          d="M25 22C28 21 34 22 36 24C34 26 27 28 25 25Z"
          fill="#F97316"
          stroke="#C2410C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Cheerful rosy cheek blush */}
        <ellipse cx="18" cy="25" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.45" />
        <ellipse cx="35" cy="25" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.4" />

        {/* Right Wing (Front flap) */}
        <path
          ref={rightWingRef}
          d="M17 26C15 31 19 36 24 33C25 31 23 27 19 25C18 25 17.5 25.5 17 26Z"
          fill="#0EA5E9"
          stroke="#0284C7"
          strokeWidth="1"
          style={{ transformOrigin: '21px 26px' }}
        />
      </svg>
    </div>
  )
}

