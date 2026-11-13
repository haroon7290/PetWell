import Link from 'next/link'
import React from 'react'

import { ClearCart } from '@/components/cart/ClearCart'
import { fulfilCheckoutSession } from '@/lib/orders'

export const metadata = { title: 'Thank you for your order' }
export const dynamic = 'force-dynamic'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let orderNumber: string | null = null
  let email: string | null = null

  if (session_id) {
    try {
      const order = await fulfilCheckoutSession(session_id)
      orderNumber = order?.orderNumber ?? null
      email = order?.customer?.email ?? null
    } catch (err) {
      console.error('Could not confirm order', err)
    }
  }

  return (
    <div className="page-width">
      <ClearCart />
      <div className="success-box">
        <div style={{ fontSize: 44 }}>🐾</div>
        <h1 style={{ fontSize: 28 }}>Thank you for your order!</h1>
        {orderNumber ? (
          <p>
            Your order number is <strong>{orderNumber}</strong>.
            {email && (
              <>
                {' '}
                We’ve sent a receipt to <strong>{email}</strong>.
              </>
            )}
          </p>
        ) : (
          <p>Your payment was received. You’ll get a confirmation email shortly.</p>
        )}
        <p>We’ll let you know as soon as it’s on its way.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn--accent">
            Continue shopping
          </Link>
          <Link href="/order-status" className="btn btn--outline">
            Check order status
          </Link>
        </div>
      </div>
    </div>
  )
}
