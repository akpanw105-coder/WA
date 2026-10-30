'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * AvatarToggle
 *
 * Shows `natural-expression` by default.
 * On desktop hover, crossfades to `laughing`.
 * On touch devices the avatar simply shows the default image — no hover state.
 */
export default function AvatarToggle() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] rounded-full overflow-hidden ring-[3px] ring-background shadow-md cursor-default select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Profile photo of Wisdom Akpan"
      role="img"
    >
      {/* Default — natural expression */}
      <Image
        src="/image/natural-expression.png.png"
        alt="Wisdom Akpan — natural expression"
        fill
        sizes="(max-width: 640px) 96px, 112px"
        className="object-cover transition-opacity duration-400"
        style={{ opacity: hovered ? 0 : 1 }}
        priority
      />
      {/* Hover — laughing */}
      <Image
        src="/image/laughing.png.png"
        alt="Wisdom Akpan — laughing"
        fill
        sizes="(max-width: 640px) 96px, 112px"
        className="object-cover transition-opacity duration-400"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </div>
  )
}

