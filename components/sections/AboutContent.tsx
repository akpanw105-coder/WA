import FadeIn from '@/components/ui/FadeIn'

export const SKILL_CATEGORIES = [
  {
    category: 'Web Development',
    skills: [
      'Next.js',
      'React',
      'JavaScript',
      'TypeScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
    ],
  },
  {
    category: 'Mobile Development',
    skills: [
      'React Native',
      'Expo',
      'Expo Router',
      'Mobile UI Design',
    ],
  },
  {
    category: 'Backend & Data',
    skills: [
      'Supabase',
      'PostgreSQL',
      'Authentication',
      'Database CRUD',
      'API Integration',
    ],
  },
  {
    category: 'Payments & AI',
    skills: [
      'Stripe',
      'Google Gemini',
    ],
  },
  {
    category: 'Tools & Workflow',
    skills: [
      'Git',
      'GitHub',
      'Vercel',
      'Postman',
    ],
  },
]

export const EXPERIENCES = [
  {
    company: 'Mercibon',
    role: 'Software Developer',
    status: 'Current',
    description:
      'Currently working on an inventory management application, developing the frontend application interface with React Native and integrating backend services with Supabase.',
    technologies: ['React Native', 'Supabase'],
  },
  {
    company: 'Co-Creative',
    role: 'Junior Frontend Developer',
    status: null,
    description:
      'Contributed to frontend development and user interface implementation for web projects.',
    technologies: ['Frontend Development', 'UI Implementation'],
  },
]

interface AboutContentProps {
  id?: string
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export default function AboutContent({
  id = 'about',
  headingLevel = 'h2',
  className = '',
}: AboutContentProps) {
  const HeadingTag = headingLevel

  return (
    <section id={id} className={`space-y-16 sm:space-y-20 ${className}`}>
      {/* ── 1. About Me Intro ──────────────────────────────────────── */}
      <div aria-labelledby={`${id}-intro-heading`}>
        <FadeIn delay={0}>
          <div className="mb-2 text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Introduction
          </div>
          <HeadingTag
            id={`${id}-intro-heading`}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6"
          >
            About Me
          </HeadingTag>
          <div className="space-y-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              I am a software engineer focused on building web and mobile applications using{' '}
              <span className="text-foreground font-medium">Next.js</span> and{' '}
              <span className="text-foreground font-medium">React Native</span>.
            </p>
            <p>
              My work spans developing modern user interfaces and integrating robust backend services with Supabase. I have engineered solutions across multiple domains, including e-commerce platforms, food ordering systems, appointment booking tools, personal finance trackers, and AI-assisted meal discovery applications.
            </p>
            <p>
              I prioritize clean architecture, performant user experiences, and turning practical problems into reliable digital products.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* ── 2. Skills ──────────────────────────────────────────────── */}
      <div aria-labelledby={`${id}-skills-heading`}>
        <FadeIn delay={80}>
          <div className="mb-2 text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Expertise
          </div>
          <h2
            id={`${id}-skills-heading`}
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-8"
          >
            Technical Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_CATEGORIES.map((cat) => (
              <div
                key={cat.category}
                className="rounded-xl border border-border/70 bg-card/50 backdrop-blur-xs p-5 sm:p-6 transition-colors hover:border-foreground/20"
              >
                <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase font-mono mb-4">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-border/80 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── 3. Experience ──────────────────────────────────────────── */}
      <div aria-labelledby={`${id}-experience-heading`}>
        <FadeIn delay={120}>
          <div className="mb-2 text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Work History
          </div>
          <h2
            id={`${id}-experience-heading`}
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-8"
          >
            Experience
          </h2>

          <div className="space-y-6">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.company}
                className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-7 transition-colors hover:border-foreground/20 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-medium text-muted-foreground">
                      {exp.company}
                    </div>
                  </div>

                  {exp.status && (
                    <span className="self-start sm:self-auto text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {exp.status}
                    </span>
                  )}
                </div>

                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-muted-foreground bg-foreground/[0.03] px-2 py-0.5 rounded border border-border/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

