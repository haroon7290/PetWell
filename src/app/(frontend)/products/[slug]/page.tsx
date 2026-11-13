import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ChatIcon, ReturnIcon, ShieldIcon, TruckIcon } from '@/components/Icons'
import { BuyBox, Gallery } from '@/components/product/ProductDetail'
import { ProductCard, RxTags } from '@/components/product/ProductCard'
import { getProductBySlug, getProducts, getSettings } from '@/lib/data'
import { imageUrl, money } from '@/lib/format'
import type { Category } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const image = imageUrl(product.images?.[0], 'large')
  return {
    title: product.metaTitle || `${product.title}${product.brand ? ` | ${product.brand}` : ''}`,
    description: product.metaDescription || product.intro || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSettings()])
  if (!product) notFound()

  const currency = settings.currency || 'gbp'
  const category = (product.categories ?? []).find((c): c is Category => typeof c === 'object')
  const related = (await getProducts({ categoryId: category?.id, limit: 8 })).filter((p) => p.id !== product.id).slice(0, 5)
  const sku = product.variants?.[0]?.sku

  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{' '}
        {category ? <Link href={`/collections/${category.slug}`}>{category.title}</Link> : <Link href="/collections/all">All products</Link>} /{' '}
        <strong>{product.title}</strong>
      </nav>

      <div className="pdp">
        <Gallery product={product} />
        <div>
          <div className="pdp__meta">
            <span className="pdp__brand">{product.brand}</span>
            {sku && <span>Product code: {sku}</span>}
          </div>
          <h1>{product.title}</h1>
          <RxTags product={product} />
          {product.intro && <p className="pdp__intro">{product.intro}</p>}
          <a href="#description" className="link-arrow" style={{ textDecoration: 'underline' }}>
            Read full description
          </a>

          <BuyBox product={product} currency={currency} pointsPerPound={settings.pointsPerPound ?? 0} />

          <ul className="assurances">
            <li>
              <TruckIcon size={18} />
              <span>
                Standard & Express delivery available*
                {settings.freeDeliveryThreshold ? (
                  <small>Free delivery on orders over {money(settings.freeDeliveryThreshold, currency)}</small>
                ) : null}
                {settings.deliveryNote && <small>{settings.deliveryNote}</small>}
              </span>
            </li>
            <li>
              <ShieldIcon size={18} /> Dispensed by qualified pharmacy staff
            </li>
            <li>
              <ReturnIcon size={18} /> Easy returns on unopened items
            </li>
            <li>
              <ChatIcon size={18} /> Friendly UK customer care
            </li>
          </ul>
        </div>
      </div>

      <section className="description" id="description">
        <h2>Description</h2>
        {product.intro && <p>{product.intro}</p>}
        {(product.benefits?.length ?? 0) > 0 && (
          <>
            <h3>Key benefits</h3>
            <ul>
              {product.benefits!.map((b) => (
                <li key={b.id}>{b.text}</li>
              ))}
            </ul>
          </>
        )}
        {(product.details ?? []).map((d) => (
          <div key={d.id}>
            <h3>{d.heading}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{d.text}</p>
          </div>
        ))}
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="section__title" style={{ marginBottom: 18 }}>
            You may also like
          </h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} currency={currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
