'use client'
import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type Row = { option?: string; secondOption?: string; price?: number; stock?: number | null }

export const VariantRowLabel = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  const name = [data?.option, data?.secondOption].filter(Boolean).join(' / ') || `Option ${(rowNumber ?? 0) + 1}`
  const price = typeof data?.price === 'number' ? ` – £${data.price.toFixed(2)}` : ''
  const stock = typeof data?.stock === 'number' ? ` (${data.stock} in stock)` : ''
  return <span>{`${name}${price}${stock}`}</span>
}
