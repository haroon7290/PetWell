import type { WidgetServerProps } from 'payload'
import React from 'react'

import { StatusPill } from './StatusCell'

export async function OrdersToShip({ req }: WidgetServerProps) {
  const { docs } = await req.payload.find({
    collection: 'orders',
    where: { status: { in: ['new', 'processing', 'on-hold'] } },
    sort: 'createdAt',
    limit: 10,
    depth: 0,
    req,
  })

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Orders to pack & ship</h3>
      {docs.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-600)', margin: 0 }}>All caught up – no orders waiting. 🎉</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--theme-elevation-600)' }}>
              <th style={{ padding: '6px 4px' }}>Order</th>
              <th style={{ padding: '6px 4px' }}>Customer</th>
              <th style={{ padding: '6px 4px' }}>Items</th>
              <th style={{ padding: '6px 4px' }}>Total</th>
              <th style={{ padding: '6px 4px' }}>Status</th>
              <th style={{ padding: '6px 4px' }}>Placed</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((o) => (
              <tr key={o.id} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                <td style={{ padding: '8px 4px' }}>
                  <a href={`/admin/collections/orders/${o.id}`} style={{ fontWeight: 600 }}>
                    {o.orderNumber}
                  </a>
                </td>
                <td style={{ padding: '8px 4px' }}>{o.placedBy}</td>
                <td style={{ padding: '8px 4px' }}>{(o.items ?? []).reduce((n, i) => n + Number(i.quantity ?? 0), 0)}</td>
                <td style={{ padding: '8px 4px' }}>£{Number(o.total ?? 0).toFixed(2)}</td>
                <td style={{ padding: '8px 4px' }}>
                  <StatusPill value={o.status} />
                </td>
                <td style={{ padding: '8px 4px' }}>{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
