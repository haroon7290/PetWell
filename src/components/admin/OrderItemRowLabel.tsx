'use client'
import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type Row = { title?: string; option?: string; quantity?: number; lineTotal?: number }

export const OrderItemRowLabel = () => {
  const { data } = useRowLabel<Row>()
  const option = data?.option ? ` (${data.option})` : ''
  const total = typeof data?.lineTotal === 'number' ? ` – £${data.lineTotal.toFixed(2)}` : ''
  return <span>{`${data?.quantity ?? 1} × ${data?.title ?? 'Item'}${option}${total}`}</span>
}
