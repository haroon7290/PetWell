import React from 'react'

import type { Product } from '@/payload-types'
import { priceSummary } from '@/lib/format'

import { ProductCard } from './ProductCard'
import { SortSelect } from './SortSelect'

export type ListingParams = { sort?: string; instock?: string; min?: string; max?: string; q?: string }

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'az', label: 'Alphabetically, A-Z' },
  { value: 'za', label: 'Alphabetically, Z-A' },
  { value: 'newest', label: 'Date, new to old' },
]

export const applyListing = (products: Product[], params: ListingParams) => {
  let list = [...products]
  if (params.instock === '1') list = list.filter((p) => priceSummary(p).inStock)
  const min = params.min ? Number(params.min) : null
  const max = params.max ? Number(params.max) : null
  if (min !== null && !Number.isNaN(min)) list = list.filter((p) => priceSummary(p).min >= min)
  if (max !== null && !Number.isNaN(max)) list = list.filter((p) => priceSummary(p).min <= max)
  switch (params.sort) {
    case 'price-asc':
      list.sort((a, b) => priceSummary(a).min - priceSummary(b).min)
      break
    case 'price-desc':
      list.sort((a, b) => priceSummary(b).min - priceSummary(a).min)
      break
    case 'az':
      list.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'za':
      list.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'newest':
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
  }
  return list
}

export const ProductListing = ({
  all,
  params,
  currency,
}: {
  all: Product[]
  params: ListingParams
  currency: string
}) => {
  const products = applyListing(all, params)
  const inStock = all.filter((p) => priceSummary(p).inStock).length
  const outOfStock = all.length - inStock
  const highest = all.reduce((m, p) => Math.max(m, priceSummary(p).max), 0)

  return (
    <div className="listing">
      {/* Phones: the filters open from this button (no JavaScript needed). */}
      <input type="checkbox" id="filter-toggle" className="filter-toggle" />
      <label htmlFor="filter-toggle" className="filter-toggle-btn btn btn--outline">
        Filter{params.instock === '1' || params.min || params.max ? ' (on)' : ''}
      </label>
      <form className="filters" method="get">
        {params.q && <input type="hidden" name="q" value={params.q} />}
        {params.sort && <input type="hidden" name="sort" value={params.sort} />}
        <div className="filters__head">Filter</div>
        <fieldset>
          <legend>Availability</legend>
          <label>
            <input type="checkbox" name="instock" value="1" defaultChecked={params.instock === '1'} /> In stock ({inStock})
          </label>
          <label style={{ color: 'var(--color-muted)' }}>
            <input type="checkbox" disabled /> Out of stock ({outOfStock})
          </label>
        </fieldset>
        <fieldset>
          <legend>Price</legend>
          <div className="filters__prices">
            <label style={{ display: 'grid', gap: 4 }}>
              From (£)
              <input type="number" name="min" min={0} step="0.01" placeholder="0" defaultValue={params.min} />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              To (£)
              <input type="number" name="max" min={0} step="0.01" placeholder={highest.toFixed(2)} defaultValue={params.max} />
            </label>
          </div>
        </fieldset>
        <button className="btn btn--primary btn--block">Apply filters</button>
      </form>

      <div>
        <div className="toolbar">
          <span>
            {products.length
              ? `Items 1–${products.length} of ${products.length}`
              : 'No items match your filters'}
          </span>
          <SortSelect value={params.sort || 'featured'} options={SORTS} />
        </div>
        {products.length ? (
          <div className="product-grid product-grid--4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} currency={currency} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
