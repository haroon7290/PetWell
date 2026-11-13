'use client'

import React, { useMemo, useState } from 'react'

import type { Product } from '@/payload-types'
import { imageUrl, isInStock, money, variantLabel } from '@/lib/format'

import { CheckIcon, GiftIcon } from '../Icons'
import { Img } from '../Img'
import { AddToBasketButton } from './AddToBasketButton'

const unique = (values: (string | null | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))]

export const Gallery = ({ product }: { product: Product }) => {
  const images = (product.images ?? []).filter((i) => i && typeof i === 'object')
  const [index, setIndex] = useState(0)
  return (
    <div>
      <div className="gallery__main">
        <Img media={images[index]} size="large" alt={product.title} priority sizes="(max-width: 860px) 100vw, 640px" />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              className="gallery__thumb"
              aria-current={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <Img media={img} size="thumbnail" />
            </button>
          ))}
        </div>
      )}
      <p className="gallery__note">Image is for illustration purposes only.</p>
    </div>
  )
}

export const BuyBox = ({
  product,
  currency,
  pointsPerPound,
}: {
  product: Product
  currency: string
  pointsPerPound: number
}) => {
  const variants = product.variants ?? []
  const firstAvailable = variants.find(isInStock) ?? variants[0]
  const [first, setFirst] = useState(firstAvailable?.option ?? null)
  const [second, setSecond] = useState(firstAvailable?.secondOption ?? null)
  const [qty, setQty] = useState(1)

  const firstValues = unique(variants.map((v) => v.option))
  const secondValues = unique(variants.map((v) => v.secondOption))

  const selected = useMemo(
    () =>
      variants.find((v) => (v.option ?? null) === first && (secondValues.length ? (v.secondOption ?? null) === second : true)) ??
      variants.find((v) => (v.option ?? null) === first) ??
      variants[0],
    [variants, first, second, secondValues.length],
  )

  if (!selected) return null
  const available = isInStock(selected)
  const onSale = Boolean(selected.compareAtPrice && selected.compareAtPrice > selected.price)
  const points = Math.floor(selected.price * pointsPerPound)

  const optionAvailable = (value: string, which: 'first' | 'second') =>
    variants.some((v) =>
      which === 'first'
        ? v.option === value && (!secondValues.length || v.secondOption === second) && isInStock(v)
        : v.secondOption === value && v.option === first && isInStock(v),
    )

  return (
    <div>
      {firstValues.length > 0 && (variants.length > 1 || secondValues.length > 0) && (
        <div className="option-group">
          <div className="option-group__label">
            <strong>{product.optionName || 'Option'}:</strong> {first}
          </div>
          <div className="option-buttons">
            {firstValues.map((v) => (
              <button
                key={v}
                type="button"
                className={`option-button ${optionAvailable(v, 'first') ? '' : 'option-button--unavailable'}`}
                aria-pressed={first === v}
                onClick={() => setFirst(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
      {secondValues.length > 0 && (
        <div className="option-group">
          <div className="option-group__label">
            <strong>{product.secondOptionName || 'Option'}:</strong> {second}
          </div>
          <div className="option-buttons">
            {secondValues.map((v) => (
              <button
                key={v}
                type="button"
                className={`option-button ${optionAvailable(v, 'second') ? '' : 'option-button--unavailable'}`}
                aria-pressed={second === v}
                onClick={() => setSecond(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pdp__price">
        <span className={`price__now ${onSale ? 'price__now--sale' : ''}`}>{money(selected.price, currency)}</span>
        {onSale && (
          <span className="price__was">
            Was <s>{money(selected.compareAtPrice, currency)}</s>
          </span>
        )}
      </div>
      <div className="pdp__vat">Price includes VAT where applicable.</div>
      <div className={`stock ${available ? '' : 'stock--out'}`} style={{ marginTop: 10 }}>
        {available ? (
          <>
            <CheckIcon size={12} /> In stock
          </>
        ) : (
          'Out of stock'
        )}
      </div>

      {product.prescriptionRequired && (
        <div className="rx-notice">
          <strong>Prescription-only medicine.</strong> Add it to your basket, then give your pet’s details and upload your vet’s
          prescription before you pay. Our pharmacy team checks every prescription before dispatch.
        </div>
      )}

      <div className="buy-row">
        <div className="qty">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <input
            type="number"
            aria-label="Quantity"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
            +
          </button>
        </div>
        <AddToBasketButton
          disabled={!available}
          quantity={qty}
          item={{
            productId: product.id,
            variantId: selected.id as string,
            slug: product.slug as string,
            title: product.title,
            brand: product.brand,
            option: variantLabel(selected),
            price: selected.price,
            image: imageUrl(product.images?.[0], 'thumbnail'),
            prescriptionRequired: Boolean(product.prescriptionRequired),
          }}
        >
          {available ? 'Add to basket' : 'Out of stock'}
        </AddToBasketButton>
      </div>

      {pointsPerPound > 0 && points > 0 && (
        <div className="points">
          <GiftIcon size={15} /> Earn <strong>{points} points</strong> with Petwell Rewards
        </div>
      )}
    </div>
  )
}
