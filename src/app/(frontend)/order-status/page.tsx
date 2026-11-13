import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'
import { money } from '@/lib/format'

export const metadata = { title: 'Order status' }
export const dynamic = 'force-dynamic'

const STATUS_TEXT: Record<string, string> = {
  new: 'Received – we’re getting it ready',
  processing: 'Being packed',
  'on-hold': 'Waiting for prescription check',
  shipped: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export default async function OrderStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; email?: string }>
}) {
  const { order: orderNumber, email } = await searchParams
  let result: React.ReactNode = null

  if (orderNumber && email) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { orderNumber: { equals: orderNumber.trim().toUpperCase() } },
          { 'customer.email': { equals: email.trim().toLowerCase() } },
        ],
      },
      limit: 1,
      depth: 0,
    })
    const o = docs[0]
    result = o ? (
      <div className="contact-card" style={{ marginTop: 20 }}>
        <h3>
          Order {o.orderNumber}: {STATUS_TEXT[o.status] ?? o.status}
        </h3>
        <p>Placed on {new Date(o.createdAt).toLocaleDateString('en-GB')}</p>
        <ul>
          {(o.items ?? []).map((i) => (
            <li key={i.id}>
              {i.quantity} × {i.title} {i.option ? `(${i.option})` : ''}
            </li>
          ))}
        </ul>
        <p>Total: {money(o.total, (o.currency || 'gbp').toLowerCase())}</p>
        {o.tracking?.trackingNumber && (
          <p>
            Tracking: {o.tracking.carrier} {o.tracking.trackingNumber}
          </p>
        )}
      </div>
    ) : (
      <p className="form-message form-message--error">
        We couldn’t find an order with those details. Please check your order number and email.
      </p>
    )
  }

  return (
    <div className="page-width" style={{ paddingBottom: 48 }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>Order status</strong>
      </nav>
      <h1 className="page-title">Check your order</h1>
      <form method="get" style={{ display: 'grid', gap: 14, maxWidth: 520 }}>
        <div className="field">
          <label htmlFor="o-num">Order number</label>
          <input id="o-num" name="order" placeholder="e.g. PW-1001" defaultValue={orderNumber} required />
        </div>
        <div className="field">
          <label htmlFor="o-email">Email used at checkout</label>
          <input id="o-email" name="email" type="email" defaultValue={email} required />
        </div>
        <div>
          <button className="btn btn--accent">Check status</button>
        </div>
      </form>
      <div style={{ maxWidth: 520 }}>{result}</div>
    </div>
  )
}
