import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Please provide your name.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json({ error: 'Please provide a subject.' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Please write a message.' }, { status: 400 })
    }

    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'akpanw284@gmail.com'

    // Option 1: Resend HTTP API (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
          to: recipientEmail,
          reply_to: email,
          subject: `Portfolio Contact: ${subject} (from ${name})`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        }),
      })

      if (!resendRes.ok) {
        const errData = await resendRes.json().catch(() => ({}))
        console.error('Resend delivery failed:', errData)
        return NextResponse.json(
          { error: 'Email service error. Please email directly at akpanw284@gmail.com' },
          { status: 502 }
        )
      }

      return NextResponse.json({ success: true, provider: 'resend' })
    }

    // Option 2: Formspree endpoint (if FORMSPREE_FORM_ID is configured)
    const formspreeId = process.env.FORMSPREE_FORM_ID
    if (formspreeId) {
      const fsRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          _replyto: email,
          subject,
          message,
        }),
      })

      if (!fsRes.ok) {
        return NextResponse.json(
          { error: 'Form delivery error. Please email directly at akpanw284@gmail.com' },
          { status: 502 }
        )
      }

      return NextResponse.json({ success: true, provider: 'formspree' })
    }

    // No credentials supplied yet
    return NextResponse.json(
      {
        error:
          'Email delivery is not yet configured. Please set RESEND_API_KEY or FORMSPREE_FORM_ID in your environment, or reach out directly at akpanw284@gmail.com.',
        unconfigured: true,
      },
      { status: 503 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error while processing message.' },
      { status: 500 }
    )
  }
}

