import type { Metadata } from 'next'
import AboutContent from '@/components/sections/AboutContent'

export const metadata: Metadata = {
  title: 'About — Wisdom Akpan',
  description:
    'Software engineer focused on building practical web and mobile applications with Next.js and React Native.',
}

export default function AboutPage() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[var(--content-width)] px-4 py-16 sm:py-24">
      <AboutContent headingLevel="h1" id="about-page" />
    </div>
  )
}
