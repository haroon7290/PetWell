'use client'

import React, { useState } from 'react'

const TOPICS = ['Order enquiry', 'Prescription query', 'Delivery', 'Returns', 'Subscription', 'Rewards', 'Product advice', 'Other']

export const ContactForm = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/next/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setState('done')
    } catch (err) {
      setState('error')
      setError(err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (state === 'done') {
    return (
      <div className="contact-card">
        <h3>Thanks – your message has been sent.</h3>
        <p>We aim to reply within one working day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" name="name" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email *</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="c-phone">Phone</label>
          <input id="c-phone" name="phone" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="c-order">Order number (if applicable)</label>
          <input id="c-order" name="orderNumber" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-topic">What’s it about?</label>
        <select id="c-topic" name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-message">Message *</label>
        <textarea id="c-message" name="message" rows={6} required />
      </div>
      {state === 'error' && <p className="form-message form-message--error">{error}</p>}
      <div>
        <button className="btn btn--accent" disabled={state === 'loading'}>
          {state === 'loading' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
