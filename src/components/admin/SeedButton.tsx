'use client'
import React, { useState } from 'react'

/** One-click import of the Pet Well products, homepage, articles and pages. */
export const SeedButton = ({ fresh = true }: { fresh?: boolean }) => {
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
      <strong>{fresh ? 'Your shop isn’t set up yet.' : 'Some homepage sections or phone photos are missing.'}</strong>
      <p style={{ margin: '6px 0 12px' }}>
        {fresh
          ? 'Import the Pet Well products, homepage, photos, articles and pages. This takes about a minute.'
          : 'This fills in only what’s empty from the original Pet Well shop (and adds the phone photos). Nothing you’ve changed is overwritten. If you emptied a section on purpose, just ignore this.'}
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
        {state === 'loading' ? 'Working… please wait' : state === 'done' ? 'Done!' : fresh ? 'Import starter content' : 'Fill in missing sections'}
      </button>
      {message && <p style={{ marginBottom: 0, color: state === 'error' ? '#C8102E' : undefined }}>{message}</p>}
    </div>
  )
}
