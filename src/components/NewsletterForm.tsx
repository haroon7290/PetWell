'use client'

import React, { useId, useState } from 'react'

export const NewsletterForm = ({ buttonClass = 'btn btn--accent' }: { buttonClass?: string }) => {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const id = useId()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setState('loading')
    try {
      const res = await fetch('/next/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setState('done')
      setMessage('Thanks for signing up! Look out for your welcome email.')
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <form className="newsletter-form" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor={id}>
          Email address
        </label>
        <input id={id} type="email" name="email" required placeholder="Enter your email address" />
        <button className={buttonClass} disabled={state === 'loading' || state === 'done'}>
          {state === 'loading' ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      {message && <p className={`form-message ${state === 'error' ? 'form-message--error' : ''}`}>{message}</p>}
      <p className="newsletter-form__legal">By signing up you agree to receive marketing emails. Unsubscribe at any time.</p>
    </div>
  )
}
