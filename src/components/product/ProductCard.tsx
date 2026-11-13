import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'
import { imageUrl, isInStock, money, priceSummary, variantLabel } from '@/lib/format'

import { CheckIcon, PillIcon, ShieldIcon } from '../Icons'
import { Img } from '../Img'
import { AddToBasketButton } from './AddToBasketButton'

const badgeClass = (badge: string) => {
  const b = badge.toLowerCase()
  if (b.includes('bestseller')) return 'badge badge--dark'
  if (b === 'new') return 'badge badge--new'
  return 'badge'
}

export const Badges = ({ product }: { product: Product }) => {
  const { bestDiscount } = priceSummary(product)
  if (!bestDiscount && !product.badge) return null
  return (
    <div className="badge-stack">
      {bestDiscount > 0 && <span className="badge badge--sale">{bestDiscount}% off</span>}
      {product.badge && <span className={badgeClass(product.badge)}>{product.badge}</span>}
    </div>
  )
}

export const RxTags = ({ product }: { product: Product }) =>
  product.prescriptionRequired || product.petRegistrationRequired ? (
    <div className="rx-tags">
      {product.prescriptionRequired && (
        <span className="rx-tag">
          <PillIcon size={11} /> Prescription required
        </span>
      )}
      {product.petRegistrationRequired && (
        <span className="rx-tag rx-tag--green">
          <ShieldIcon size={11} /> Pet registration required
        </span>
      )}
    </div>
  ) : null

export const ProductCard = ({ product, currency = 'gbp' }: { product: Product; currency?: string }) => {
  const s = priceSummary(product)
  const variants = product.variants ?? []
  const single = variants.length === 1 && !product.prescriptionRequired ? variants[0] : null
  const href = `/products/${product.slug}`
  const firstImage = product.images?.[0]

  return (
    <div className="product-card">
      <Badges product={product} />
      <Link href={href} className="product-card__media" aria-hidden tabIndex={-1}>
        <Img media={firstImage} size="card" alt={product.title} sizes="(max-width: 860px) 50vw, 260px" />
      </Link>
      {product.brand && <div className="product-card__brand">{product.brand}</div>}
      <h3 className="product-card__title">
        <Link href={href}>{product.title}</Link>
      </h3>
      <RxTags product={product} />
      <div className="product-card__bottom">
        <div className={`stock ${s.inStock ? '' : 'stock--out'}`}>
          {s.inStock ? (
            <>
              <CheckIcon size={12} /> In stock
            </>
          ) : (
            'Out of stock'
          )}
        </div>
        <div className="price">
          {s.from && <span>From</span>}
          <span className={`price__now ${s.compareAt ? 'price__now--sale' : ''}`}>{money(s.min, currency)}</span>
          {s.compareAt && (
            <span className="price__was">
              Was <s>{money(s.compareAt, currency)}</s>
            </span>
          )}
        </div>
        {single ? (
          <AddToBasketButton
            disabled={!isInStock(single)}
            item={{
              productId: product.id,
              variantId: single.id as string,
              slug: product.slug as string,
              title: product.title,
              brand: product.brand,
              option: variantLabel(single),
              price: single.price,
              image: imageUrl(firstImage, 'thumbnail'),
              prescriptionRequired: Boolean(product.prescriptionRequired),
            }}
          />
        ) : (
          <Link href={href} className="btn btn--outline">
            View details
          </Link>
        )}
      </div>
    </div>
  )
}
