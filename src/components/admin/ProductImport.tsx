'use client'
import React, { useState } from 'react'

type Result = { created: string[]; updated: string[]; hidden: string[]; errors: string[]; photoProblems: string[]; error?: string }

/** Dashboard widget: upload a spreadsheet (CSV) to add or update many products at once. */
export const ProductImport = () => {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/next/import-products', { method: 'POST', body: new FormData(e.currentTarget), credentials: 'include' })
      setResult(await res.json())
    } catch {
      setResult({ created: [], updated: [], hidden: [], photoProblems: [], errors: ['Upload failed. Please try again.'] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card" style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ margin: 0 }}>Import products from a spreadsheet</h3>
      <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
        Add or update many products at once. Fill in the{' '}
        <a href="/next/import-products" style={{ textDecoration: 'underline' }}>
          template (CSV)
        </a>{' '}
        in Excel or Google Sheets, save it as CSV, then upload it here. Photos are downloaded from the links in the file.
        Products without a price are added hidden until you set one.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="file" name="file" accept=".csv,text/csv" required />
        <button
          type="submit"
          disabled={busy}
          style={{ background: '#1E5B4F', color: '#fff', border: 0, borderRadius: 6, padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}
        >
          {busy ? 'Importing… (can take a minute)' : 'Import products'}
        </button>
      </form>
      {result && (
        <div style={{ fontSize: 14, display: 'grid', gap: 4 }}>
          {result.error && <div style={{ color: '#C8102E' }}>{result.error}</div>}
          {result.created?.length > 0 && <div>✅ Added {result.created.length}: {result.created.join(', ')}</div>}
          {result.updated?.length > 0 && <div>🔄 Updated {result.updated.length}: {result.updated.join(', ')}</div>}
          {result.hidden?.length > 0 && <div>🙈 Hidden until you check them: {result.hidden.join(', ')}</div>}
          {result.photoProblems?.length > 0 && <div style={{ color: '#B45309' }}>⚠️ Photos not downloaded: {result.photoProblems.join('; ')}</div>}
          {result.errors?.length > 0 && <div style={{ color: '#C8102E' }}>❌ {result.errors.join('; ')}</div>}
        </div>
      )}
    </div>
  )
}
