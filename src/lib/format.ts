import type { Media, Product } from '@/payload-types'

export const CURRENCY_SYMBOL: Record<string, string> = { gbp: '£', usd: '$' }

export const money = (value: number | null | undefined, currency = 'gbp') =>
  `${CURRENCY_SYMBOL[currency] ?? '£'}${Number(value ?? 0).toFixed(2)}`

export type Variant = NonNullable<Product['variants']>[number]

export const variantLabel = (v: Pick<Variant, 'option' | 'secondOption'>) =>
  [v.option, v.secondOption].filter(Boolean).join(' / ')

export const isInStock = (v: Pick<Variant, 'stock'>) => v.stock === null || v.stock === undefined || v.stock > 0

/** Price summary used on product cards: lowest price, highest "was" price, whether there's a choice. */
export const priceSummary = (product: Pick<Product, 'variants'>) => {
  const variants = product.variants ?? []
  const prices = variants.map((v) => v.price ?? 0)
  const min = prices.length ? Math.min(...prices) : 0
  const max = prices.length ? Math.max(...prices) : 0
  const compare = variants
    .map((v) => v.compareAtPrice ?? 0)
    .filter((c) => c > 0)
  const maxCompare = compare.length ? Math.max(...compare) : 0
  // Like the original theme: the "% off" badge reflects the first (default) option.
  const first = variants[0]
  const bestDiscount =
    first?.compareAtPrice && first.compareAtPrice > (first.price ?? 0)
      ? Math.round((1 - (first.price ?? 0) / first.compareAtPrice) * 100)
      : 0
  return {
    min,
    max,
    from: min !== max,
    compareAt: maxCompare > min ? maxCompare : null,
    bestDiscount,
    inStock: variants.some(isInStock),
  }
}

/** Media helper: returns the best URL for a Payload image at a given size. */
export const imageUrl = (media: unknown, size?: 'thumbnail' | 'card' | 'large'): string | null => {
  if (!media || typeof media !== 'object') return null
  const m = media as Media
  if (size && m.sizes?.[size]?.url) return m.sizes[size]!.url as string
  return m.url ?? null
}

export const imageAlt = (media: unknown, fallback = '') =>
  media && typeof media === 'object' ? ((media as Media).alt ?? fallback) : fallback
