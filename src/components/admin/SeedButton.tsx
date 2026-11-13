'use client'
import React, { useState } from 'react'

/** One-click import of the Pet Well products, homepage, articles and pages. */
export const SeedButton = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const run = async () => {
    setState('loading')
    try {
      const res = await fetch('/next/seed', { method: 'POST', credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Import failed')
      setState('done')
      setMessage(json.message)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Import failed')
    }
  }

  return (
    <div
      style={{
        border: '2px dashed #F28C28',
        borderRadius: 10,
        padding: 16,
        background: 'rgba(242,140,40,0.07)',
      }}
    >
      <strong>Your shop is empty.</strong>
      <p style={{ margin: '6px 0 12px' }}>
        Import the Pet Well products, homepage, photos, articles and pages to get started. This takes about a minute.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={state === 'loading' || state === 'done'}
        style={{
          background: '#1E5B4F',
          color: '#fff',
          border: 0,
          borderRadius: 6,
          padding: '10px 16px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {state === 'loading' ? 'Importing… please wait' : state === 'done' ? 'Done!' : 'Import starter content'}
      </button>
      {message && <p style={{ marginBottom: 0, color: state === 'error' ? '#C8102E' : undefined }}>{message}</p>}
    </div>
  )
}
