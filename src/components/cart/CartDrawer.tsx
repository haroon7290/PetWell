'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

import { money } from '@/lib/format'

import { CartLines, FreeDeliveryProgress } from './CartLines'
import { useCart } from './CartProvider'

export const CartDrawer = () => {
  const { isOpen, close, items, subtotal, currency, count } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-backdrop" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your basket">
        <div className="drawer__head">
          <h2>Your basket {count > 0 && `(${count})`}</h2>
          <button className="drawer__close" onClick={close} aria-label="Close basket">
            ×
          </button>
        </div>
        <div className="drawer__body">
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0' }}>Your basket is empty.</p>
          ) : (
            <>
              <div style={{ marginTop: 10 }}>
                <FreeDeliveryProgress />
              </div>
              <CartLines onNavigate={close} />
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="totals">
              <div className="totals__grand">
                <span>Subtotal</span>
                <span>{money(subtotal, currency)}</span>
              </div>
              <small style={{ color: 'var(--color-muted)' }}>Delivery and discount codes are added at checkout.</small>
            </div>
            <Link href="/cart" className="btn btn--accent btn--block" onClick={close}>
              View basket & checkout
            </Link>
            <button type="button" className="btn btn--outline btn--block" onClick={close}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
