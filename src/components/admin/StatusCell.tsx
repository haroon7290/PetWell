'use client'
import type { DefaultCellComponentProps } from 'payload'
import React from 'react'

const STYLES: Record<string, { bg: string; fg: string; label: string }> = {
  new: { bg: '#FFF1E2', fg: '#B45309', label: 'New – to pack' },
  processing: { bg: '#E0F2FE', fg: '#075985', label: 'Packing' },
  'on-hold': { bg: '#EDE9FE', fg: '#5B3FA8', label: 'On hold' },
  shipped: { bg: '#DCFCE7', fg: '#166534', label: 'Shipped' },
  delivered: { bg: '#E5E7EB', fg: '#374151', label: 'Delivered' },
  cancelled: { bg: '#FEE2E2', fg: '#991B1B', label: 'Cancelled' },
  refunded: { bg: '#FEE2E2', fg: '#991B1B', label: 'Refunded' },
  pending: { bg: '#FFF1E2', fg: '#B45309', label: 'Waiting for check' },
  approved: { bg: '#DCFCE7', fg: '#166534', label: 'Approved' },
  rejected: { bg: '#FEE2E2', fg: '#991B1B', label: 'Rejected' },
  replied: { bg: '#E5E7EB', fg: '#374151', label: 'Replied' },
}

export const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => <StatusPill value={cellData} />

export const StatusPill = ({ value: raw }: { value: unknown }) => {
  const value = String(raw ?? '')
  const s = STYLES[value] ?? { bg: '#F3F4F6', fg: '#374151', label: value || '—' }
  return (
    <span
      style={{
        background: s.bg,
        color: s.fg,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  )
}
