import Link from 'next/link'
import React, { Suspense } from 'react'

import { ProductListing, type ListingParams } from '@/components/product/ProductListing'
import { getProducts, getSettings } from '@/lib/data'

export const metadata = { title: 'Search' }

export default async function SearchPage({ searchParams }: { searchParams: Promise<ListingParams> }) {
  const query = await searchParams
  const q = (query.q || '').trim()
  const [products, settings] = await Promise.all([q ? getProducts({ search: q }) : getProducts(), getSettings()])

  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>Search</strong>
      </nav>
      <h1 className="page-title">{q ? `Results for “${q}”` : 'Search'}</h1>
      <Suspense>
        <ProductListing all={products} params={query} currency={settings.currency || 'gbp'} />
      </Suspense>
    </div>
  )
}
