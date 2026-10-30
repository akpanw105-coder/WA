import type { Metadata } from 'next'
import FadeIn from '@/components/ui/FadeIn'
import ProjectsShowcase from '@/components/sections/ProjectsShowcase'
import GithubCalendar from '@/components/sections/GithubCalendar'

export const metadata: Metadata = {
  title: 'Projects — Wisdom Akpan',
  description: 'Selected web and mobile engineering projects by Wisdom Akpan.',
}

export default function ProjectsPage() {
  return (
    <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20 space-y-16">
      {/* ── Expansive Interactive Showcase Section ────────────────── */}
      <section
        aria-label="Interactive projects showcase"
        className="mx-auto w-full max-w-6xl"
      >
        <FadeIn delay={0}>
          <ProjectsShowcase
            mode="full"
            title="Production Deployments"
            subtitle="Explore all 7 full-stack web and mobile applications engineered with Next.js, React Native, and Supabase."
          />
        </FadeIn>
      </section>

      {/* ── GitHub Contributions Calendar ────────────────────────── */}
      <section
        aria-label="GitHub Contributions Activity"
        className="mx-auto w-full max-w-[var(--content-width)] pb-8"
      >
        <FadeIn delay={150}>
          <GithubCalendar />
        </FadeIn>
      </section>
    </div>
  )
}
