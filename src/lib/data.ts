import { cache } from 'react'

import type { Category, Homepage, Post, Product, SiteSetting } from '@/payload-types'

import { getPayloadClient } from './payload'

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHomepage = cache(async (): Promise<Homepage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 2 })
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', sort: 'sortOrder', limit: 100, depth: 1 })
  return docs
})

const published = { status: { equals: 'published' } } as const

export const getProducts = async ({
  categoryId,
  search,
  sort = '-createdAt',
  limit = 100,
}: {
  categoryId?: number | string
  search?: string
  sort?: string
  limit?: number
} = {}): Promise<Product[]> => {
  const payload = await getPayloadClient()
  const and: Record<string, unknown>[] = [published]
  if (categoryId) and.push({ categories: { in: [categoryId] } })
  if (search) {
    and.push({
      or: [{ title: { like: search } }, { brand: { like: search } }, { intro: { like: search } }],
    })
  }
  const { docs } = await payload.find({
    collection: 'products',
    where: { and } as never,
    sort,
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return docs
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, published] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

export const getPosts = async (limit = 12): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: published,
    sort: '-publishedAt',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return docs
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, published] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

export const getPageBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

/** Keep only fully-loaded product objects from a relationship field. */
export const asProducts = (value: unknown): Product[] =>
  Array.isArray(value)
    ? (value.filter((p) => p && typeof p === 'object' && (p as Product).status === 'published') as Product[])
    : []
