'use client'
import type { DefaultCellComponentProps } from 'payload'
import React from 'react'

type Variant = { price?: number | null; stock?: number | null }

/** Products list: shows the price range and a stock summary instead of raw option data. */
export const PriceCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const variants = (Array.isArray(cellData) ? cellData : []) as Variant[]
  if (!variants.length) return <span>—</span>
  const prices = variants.map((v) => Number(v.price ?? 0))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const price = min === max ? `£${min.toFixed(2)}` : `£${min.toFixed(2)} – £${max.toFixed(2)}`

  const soldOut = variants.filter((v) => v.stock === 0).length
  const low = variants.filter((v) => typeof v.stock === 'number' && v.stock > 0 && v.stock <= 5).length
  let note = `${variants.length} option${variants.length > 1 ? 's' : ''}`
  let alert = false
  if (soldOut === variants.length) {
    note = 'Sold out'
    alert = true
  } else if (soldOut) {
    note = `${soldOut} of ${variants.length} sold out`
    alert = true
  } else if (low) {
    note = 'Low stock'
    alert = true
  }

  return (
    <span>
      {price}
      <br />
      <span style={{ color: alert ? '#C8102E' : '#6B7280', fontSize: 12 }}>{note}</span>
    </span>
  )
}
