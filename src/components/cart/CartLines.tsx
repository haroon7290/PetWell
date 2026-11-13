'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import React from 'react'

import { money } from '@/lib/format'

import { useCart } from './CartProvider'

export const FreeDeliveryProgress = () => {
  const { subtotal, freeDeliveryThreshold, currency } = useCart()
  if (!freeDeliveryThreshold) return null
  const remaining = freeDeliveryThreshold - subtotal
  const pct = Math.min(100, (subtotal / freeDeliveryThreshold) * 100)
  return (
    <div className="free-delivery">
      {remaining > 0 ? (
        <>
          You’re <strong>{money(remaining, currency)}</strong> away from free delivery
        </>
      ) : (
        <strong>You’ve unlocked free delivery!</strong>
      )}
      <div className="free-delivery__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export const CartLines = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { items, update, remove, currency } = useCart()
  return (
    <div>
      {items.map((item) => (
        <div className="cart-line" key={item.variantId}>
          {item.image ? <img src={item.image} alt="" /> : <div style={{ width: 72, height: 72, background: '#eef3f1', borderRadius: 8 }} />}
          <div>
            <Link href={`/products/${item.slug}`} className="cart-line__title" onClick={onNavigate}>
              {item.title}
            </Link>
            {item.option && <div className="cart-line__option">{item.option}</div>}
            {item.prescriptionRequired && <div className="cart-line__option" style={{ color: 'var(--color-badge-rx)' }}>Prescription required</div>}
            <div className="cart-line__actions">
              <div className="qty">
                <button type="button" aria-label="Decrease quantity" onClick={() => update(item.variantId, item.quantity - 1)}>
                  −
                </button>
                <input aria-label="Quantity" value={item.quantity} readOnly />
                <button type="button" aria-label="Increase quantity" onClick={() => update(item.variantId, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button type="button" className="link-button" onClick={() => remove(item.variantId)}>
                Remove
              </button>
            </div>
          </div>
          <strong>{money(item.price * item.quantity, currency)}</strong>
        </div>
      ))}
    </div>
  )
}
