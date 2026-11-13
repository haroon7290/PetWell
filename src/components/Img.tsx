/* eslint-disable @next/next/no-img-element */
import React from 'react'

import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'large'

const MOBILE_QUERY = '(max-width: 860px)'

const asMedia = (media: unknown): Media | null => (media && typeof media === 'object' ? (media as Media) : null)

const srcSetFor = (m: Media) =>
  (['thumbnail', 'card', 'large'] as const)
    .map((s) => m.sizes?.[s])
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.url && s.width))
    .map((s) => `${s.url} ${s.width}w`)
    .join(', ')

/** Uses the focus point set in the admin (click on the photo) when the image is cropped. */
const focalPosition = (m: Media) =>
  typeof m.focalX === 'number' && typeof m.focalY === 'number' ? `${m.focalX}% ${m.focalY}%` : undefined

/**
 * Renders a Payload image with a responsive srcset built from its generated sizes.
 * Pass `mobileMedia` to show a different photo on phones.
 * Plain <img> keeps things simple and avoids Vercel image-optimisation limits.
 */
export const Img = ({
  media,
  mobileMedia,
  size = 'card',
  alt,
  className,
  priority,
  sizes,
}: {
  media: unknown
  mobileMedia?: unknown
  size?: Size
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
}) => {
  const m = asMedia(media) ?? asMedia(mobileMedia)
  if (!m) {
    return <div className={className} style={{ background: '#eef3f1', width: '100%', height: '100%' }} aria-hidden />
  }
  const mobile = asMedia(mobileMedia)
  const srcSet = srcSetFor(m)
  const src = m.sizes?.[size]?.url || m.url || ''

  const img = (
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt ?? m.alt ?? ''}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
      style={{ objectPosition: focalPosition(m) }}
    />
  )

  if (!mobile || mobile.id === m.id) return img

  return (
    <picture className="picture">
      <source media={MOBILE_QUERY} srcSet={srcSetFor(mobile) || mobile.url || undefined} sizes="100vw" />
      {img}
    </picture>
  )
}
