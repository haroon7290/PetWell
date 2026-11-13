'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { money } from '@/lib/format'

import { CartLines, FreeDeliveryProgress } from './CartLines'
import { useCart } from './CartProvider'

const PrescriptionForm = () => {
  const { prescription, setPrescription } = useCart()
  const [sendLater, setSendLater] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (prescription) {
    return (
      <div className="rx-form">
        <h3>Prescription details added ✓</h3>
        <p style={{ margin: 0 }}>
          Thanks – we have the details for <strong>{prescription.petName}</strong>. Our pharmacy team will check them before
          your order is sent.
        </p>
        <button type="button" className="link-button" style={{ justifySelf: 'start' }} onClick={() => setPrescription(null)}>
          Change details
        </button>
      </div>
    )
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/next/prescription', { method: 'POST', body: new FormData(e.currentTarget) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setPrescription({ id: json.id, petName: json.petName })
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not save the prescription. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="rx-form" onSubmit={onSubmit}>
      <h3>Your pet’s prescription</h3>
      <p style={{ margin: 0, fontSize: 14 }}>
        Your basket contains prescription-only medicine. Please tell us about your pet and upload the prescription from your
        vet.
      </p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="rx-pet">Pet’s name *</label>
          <input id="rx-pet" name="petName" required />
        </div>
        <div className="field">
          <label htmlFor="rx-species">Type of pet</label>
          <input id="rx-species" name="species" placeholder="e.g. Dog" />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="rx-owner">Your name *</label>
          <input id="rx-owner" name="ownerName" required />
        </div>
        <div className="field">
          <label htmlFor="rx-vet">Vet practice</label>
          <input id="rx-vet" name="vetPractice" />
        </div>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="sendingSeparately" checked={sendLater} onChange={(e) => setSendLater(e.target.checked)} />
        I’ll send the prescription by email or post instead
      </label>
      {!sendLater && (
        <div className="field">
          <label htmlFor="rx-file">Prescription (photo or PDF) *</label>
          <input id="rx-file" name="file" type="file" accept="image/*,application/pdf" required />
        </div>
      )}
      {error && <p className="form-message form-message--error">{error}</p>}
      <button className="btn btn--primary" disabled={busy}>
        {busy ? 'Saving…' : 'Save prescription details'}
      </button>
    </form>
  )
}

export const CartPage = () => {
  const { items, subtotal, currency, hasPrescriptionItems, prescription, freeDeliveryThreshold } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <div className="success-box">
        <h2>Your basket is empty</h2>
        <p>Find food, healthcare and accessories for every pet.</p>
        <Link href="/collections/all" className="btn btn--accent">
          Start shopping
        </Link>
      </div>
    )
  }

  const blocked = hasPrescriptionItems && !prescription

  const checkout = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/next/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          prescriptionId: prescription?.id ?? null,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error)
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Checkout is not available right now.')
      setBusy(false)
    }
  }

  return (
    <div className="cart-page">
      <div>
        <CartLines />
        {hasPrescriptionItems && <PrescriptionForm />}
      </div>
      <aside className="summary-card">
        <h2 style={{ fontSize: 20, margin: 0 }}>Order summary</h2>
        <FreeDeliveryProgress />
        <div className="totals">
          <div>
            <span>Subtotal</span>
            <span>{money(subtotal, currency)}</span>
          </div>
          <div>
            <span>Delivery</span>
            <span>{freeDeliveryThreshold && subtotal >= freeDeliveryThreshold ? 'Free' : 'Calculated at checkout'}</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-muted)' }}>Have a discount code? You can add it on the next page.</p>
        {blocked && (
          <p className="form-message form-message--error" style={{ margin: 0 }}>
            Please add your pet’s prescription details before checking out.
          </p>
        )}
        {error && (
          <p className="form-message form-message--error" style={{ margin: 0 }}>
            {error}
          </p>
        )}
        <button className="btn btn--accent btn--block" onClick={checkout} disabled={busy || blocked}>
          {busy ? 'Taking you to secure checkout…' : 'Checkout securely'}
        </button>
        <small style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Payments are processed securely by Stripe.</small>
      </aside>
    </div>
  )
}
