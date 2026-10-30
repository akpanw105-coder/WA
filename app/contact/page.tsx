import type { Metadata } from 'next'
import FadeIn from '@/components/ui/FadeIn'
import ContactForm from '@/components/ui/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Wisdom Akpan',
  description:
    'Get in touch with Wisdom Akpan for software engineering projects, web applications, or mobile apps.',
}

const CONTACT_METHODS = [
  {
    name: 'Email',
    value: 'akpanw284@gmail.com',
    href: 'mailto:akpanw284@gmail.com',
    label: 'Send direct email',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    value: '+234 704 429 7649',
    href: 'https://wa.me/2347044297649',
    label: 'Chat on WhatsApp',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    value: 'github.com/akpanw105-coder',
    href: 'https://github.com/akpanw105-coder',
    label: 'Visit GitHub profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: 'X',
    value: 'x.com/akpan_wisd8378',
    href: 'https://x.com/akpan_wisd8378',
    label: 'Visit X profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[var(--content-width)] px-4 py-16 sm:py-24 space-y-16 sm:space-y-20">
      {/* Page Header */}
      <section>
        <FadeIn delay={0}>
          <div className="mb-2 text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Let's Connect
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Have a project in mind, an opportunity to discuss, or want to collaborate on a web or mobile application? Feel free to send a message or connect through any of the channels below.
          </p>
        </FadeIn>
      </section>

      {/* Grid: Contact Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left column: Direct Contact Methods */}
        <div className="lg:col-span-5 space-y-6">
          <FadeIn delay={80}>
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
              Direct Channels
            </h2>
            <div className="space-y-3">
              {CONTACT_METHODS.map((method) => (
                <a
                  key={method.name}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={method.label}
                  className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-4 transition-all hover:border-foreground/20 hover:bg-card/90 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04] text-foreground border border-border/60 transition-colors group-hover:bg-foreground/[0.08]">
                    {method.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      {method.name}
                    </div>
                    <div className="text-sm font-medium text-foreground truncate mt-0.5">
                      {method.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <FadeIn delay={140}>
            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1.5">
                Send a Message
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill in your project details and I will get back to you promptly.
              </p>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

