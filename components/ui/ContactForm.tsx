'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status !== 'idle') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side quick validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill out all fields.')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to send message. Please try again.')
        return
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again or email directly at akpanw284@gmail.com.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
        />
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="Project inquiry / Opportunity"
          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project, timeline, and goals..."
          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all resize-y"
        />
      </div>

      {/* Feedback Messages */}
      {status === 'success' && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          <p className="font-medium">Thank you for reaching out!</p>
          <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
            Your message has been sent successfully. I will get back to you shortly.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
          <p className="font-medium">Delivery Notice</p>
          <p className="text-xs mt-1 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-primary-foreground transition-all hover:opacity-85 active:scale-95 disabled:opacity-50 shadow-xs"
      >
        {status === 'loading' ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
            <span>Sending Message...</span>
          </>
        ) : (
          <span>Send Message</span>
        )}
      </button>
    </form>
  )
}

