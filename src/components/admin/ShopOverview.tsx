import type { WidgetServerProps } from 'payload'
import React from 'react'

import { SeedButton } from './SeedButton'

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 10,
  padding: '16px 18px',
  background: 'var(--theme-elevation-0)',
  textDecoration: 'none',
  color: 'var(--theme-text)',
  display: 'block',
}

const Stat = ({ label, value, href, alert }: { label: string; value: string | number; href: string; alert?: boolean }) => (
  <a href={href} style={card}>
    <div style={{ fontSize: 13, color: 'var(--theme-elevation-600)' }}>{label}</div>
    <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4, color: alert ? '#C2410C' : undefined }}>{value}</div>
  </a>
)

const Action = ({ label, href, primary }: { label: string; href: string; primary?: boolean }) => (
  <a
    href={href}
    style={{
      padding: '10px 16px',
      borderRadius: 6,
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
      background: primary ? '#F28C28' : 'var(--theme-elevation-100)',
      color: primary ? '#fff' : 'var(--theme-text)',
    }}
  >
    {label}
  </a>
)

export async function ShopOverview({ req }: WidgetServerProps) {
  const { payload } = req
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [toPack, onHold, rxPending, newMessages, productCount, monthOrders, products] = await Promise.all([
    payload.count({ collection: 'orders', where: { status: { in: ['new', 'processing'] } }, req }),
    payload.count({ collection: 'orders', where: { status: { equals: 'on-hold' } }, req }),
    payload.count({ collection: 'prescriptions', where: { status: { equals: 'pending' } }, req }),
    payload.count({ collection: 'messages', where: { status: { equals: 'new' } }, req }),
    payload.count({ collection: 'products', req }),
    payload.find({
      collection: 'orders',
      where: { and: [{ createdAt: { greater_than_equal: startOfMonth.toISOString() } }, { paymentStatus: { equals: 'paid' } }] },
      limit: 1000,
      depth: 0,
      select: { total: true },
      req,
    }),
    payload.find({ collection: 'products', limit: 500, depth: 0, select: { variants: true }, req }),
  ])

  const home = await payload.findGlobal({ slug: 'homepage', depth: 0, req })
  const needsImport = productCount.totalDocs === 0 || !(home.heroSlides?.length ?? 0)

  const revenue = monthOrders.docs.reduce((sum, o) => sum + Number(o.total ?? 0), 0)
  const lowStock = products.docs.filter((p) =>
    (p.variants ?? []).some((v) => typeof v.stock === 'number' && v.stock <= 5),
  ).length

  const user = req.user as { name?: string | null; email?: string } | null
  const name = user?.name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="card" style={{ display: 'grid', gap: 18 }}>
      <div>
        <h2 style={{ margin: 0 }}>Hello {name} 👋</h2>
        <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-600)' }}>Here’s what needs your attention today.</p>
      </div>

      {needsImport && <SeedButton />}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <Stat label="Orders to pack & ship" value={toPack.totalDocs} href="/admin/collections/orders" alert={toPack.totalDocs > 0} />
        <Stat label="Orders on hold" value={onHold.totalDocs} href="/admin/collections/orders" />
        <Stat label="Prescriptions to check" value={rxPending.totalDocs} href="/admin/collections/prescriptions" alert={rxPending.totalDocs > 0} />
        <Stat label="New messages" value={newMessages.totalDocs} href="/admin/collections/messages" alert={newMessages.totalDocs > 0} />
        <Stat label="Sales this month" value={`£${revenue.toFixed(2)}`} href="/admin/collections/orders" />
        <Stat label="Products low or sold out" value={lowStock} href="/admin/collections/products" alert={lowStock > 0} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Action label="+ Add a product" href="/admin/collections/products/create" primary />
        <Action label="View all orders" href="/admin/collections/orders" />
        <Action label="Edit homepage" href="/admin/globals/homepage" />
        <Action label="Banners & delivery prices" href="/admin/globals/site-settings" />
        <Action label="Open the website ↗" href="/" />
      </div>
    </div>
  )
}
