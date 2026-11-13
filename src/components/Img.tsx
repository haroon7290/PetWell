/* eslint-disable @next/next/no-img-element */
import React from 'react'

import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'large'

/**
 * Renders a Payload image with a responsive srcset built from its generated sizes.
 * Plain <img> keeps things simple and avoids Vercel image-optimisation limits.
 */
export const Img = ({
  media,
  size = 'card',
  alt,
  className,
  priority,
  sizes,
}: {
  media: unknown
  size?: Size
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
}) => {
  if (!media || typeof media !== 'object') {
    return <div className={className} style={{ background: '#eef3f1', width: '100%', height: '100%' }} aria-hidden />
  }
  const m = media as Media
  const candidates = (['thumbnail', 'card', 'large'] as const)
    .map((s) => m.sizes?.[s])
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.url && s.width))
  const srcSet = candidates.map((s) => `${s.url} ${s.width}w`).join(', ')
  const src = m.sizes?.[size]?.url || m.url || ''
  return (
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
    />
  )
}
