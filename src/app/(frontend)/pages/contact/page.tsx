import Link from 'next/link'
import React from 'react'

import { ContactForm } from '@/components/ContactForm'
import { getSettings } from '@/lib/data'

export const metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await getSettings()
  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>Contact</strong>
      </nav>
      <h1 className="page-title">Contact</h1>
      <div className="contact">
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>Send us a message</h2>
          <p style={{ marginTop: 0, color: 'var(--color-muted)' }}>We aim to reply within one working day.</p>
          <ContactForm />
        </div>
        <div>
          {settings.phone && (
            <div className="contact-card">
              <h3>Call us</h3>
              <p>{settings.phone}</p>
            </div>
          )}
          {settings.email && (
            <div className="contact-card">
              <h3>Email us</h3>
              <p>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
            </div>
          )}
          {settings.openingHours && (
            <div className="contact-card">
              <h3>Opening hours</h3>
              <p>{settings.openingHours}</p>
            </div>
          )}
          <div className="contact-card">
            <h3>Prescription queries</h3>
            <p>Our pharmacy team can help with any prescription questions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
