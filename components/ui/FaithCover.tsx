import Image from 'next/image'

/**
 * FaithCover
 *
 * Displays the "Faith Over Fear: Mountain Sunrise" cover image.
 * The image contains the "FAITH OVER FEAR" text as part of its design —
 * preserved exactly as-is without additional overlays.
 *
 * Rendered as a Server Component (no interactivity needed).
 */
export default function FaithCover() {
  return (
    <figure className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '3/1' }}>
      <Image
        src="/image/Faith Over Fear_ Mountain Sunrise.png"
        alt="Faith Over Fear — Mountain Sunrise. A motivational cover image with the text 'FAITH OVER FEAR' prominently displayed."
        fill
        className="object-cover"
        priority
      />
    </figure>
  )
}

