import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

import { ProductListing, type ListingParams } from '@/components/product/ProductListing'
import { getCategoryBySlug, getProducts, getSettings } from '@/lib/data'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<ListingParams> }

const ALL = ['all', 'all-products']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (ALL.includes(slug)) return { title: 'All products' }
  const category = await getCategoryBySlug(slug)
  return { title: category?.title ?? 'Products', description: category?.description ?? undefined }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const query = await searchParams
  const isAll = ALL.includes(slug)
  const category = isAll ? null : await getCategoryBySlug(slug)
  if (!isAll && !category) notFound()

  const [products, settings] = await Promise.all([
    getProducts({ categoryId: category?.id }),
    getSettings(),
  ])
  const title = category?.title ?? 'All products'

  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>{title}</strong>
      </nav>
      <h1 className="page-title">{title}</h1>
      {category?.description && <p style={{ marginTop: -8, color: 'var(--color-muted)' }}>{category.description}</p>}
      <Suspense>
        <ProductListing all={products} params={query} currency={settings.currency || 'gbp'} />
      </Suspense>
    </div>
  )
}
