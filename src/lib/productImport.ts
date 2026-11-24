import type { Payload } from 'payload'

import { slugify } from './slug'

/**
 * Bulk product import from a spreadsheet (CSV).
 *
 * One row per size/option. Rows with the same `handle` become one product;
 * product details (title, description, photos…) are read from the first row.
 *
 * Columns (header names are case-insensitive):
 *   handle, title, brand, category, option_name, option, second_option_name, second_option,
 *   price, was_price, stock, sku, intro, benefits, details, badge,
 *   prescription_required, pet_registration_required, image_urls, status
 *
 * - benefits:   separate items with |
 * - details:    "Heading: text" sections separated by ||
 * - image_urls: photo web addresses separated by |
 * - category:   one or more category names separated by | (created if missing)
 * - status:     "published" (live) or "draft" (hidden). Rows without a price are always imported hidden.
 */

export type ImportResult = { created: string[]; updated: string[]; hidden: string[]; errors: string[]; photoProblems: string[] }

export const parseCsv = (text: string): Record<string, string>[] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ''))
  if (!nonEmpty.length) return []
  const header = nonEmpty[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'))
  return nonEmpty.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

const num = (v: string | undefined) => {
  if (!v) return undefined
  const n = Number(v.replace(/[£$,\s]/g, ''))
  return Number.isFinite(n) ? n : undefined
}
const yes = (v: string | undefined) => /^(y|yes|true|1)$/i.test(v ?? '')
const split = (v: string | undefined, sep: string) =>
  (v ?? '')
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean)

const MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }

export const importProducts = async (payload: Payload, csv: string): Promise<ImportResult> => {
  const result: ImportResult = { created: [], updated: [], hidden: [], errors: [], photoProblems: [] }
  const rows = parseCsv(csv)
  if (!rows.length) {
    result.errors.push('The file is empty or has no header row.')
    return result
  }
  if (!('handle' in rows[0]) && !('title' in rows[0])) {
    result.errors.push('Could not find the "handle" or "title" column. Please use the template.')
    return result
  }

  // Group rows by product
  const groups = new Map<string, Record<string, string>[]>()
  for (const r of rows) {
    const handle = slugify(r.handle || r.title || '')
    if (!handle) continue
    groups.set(handle, [...(groups.get(handle) ?? []), r])
  }

  // Categories (by name or web address), created when missing
  const categoryCache = new Map<string, number | string>()
  const categoryId = async (name: string) => {
    const slug = slugify(name)
    if (categoryCache.has(slug)) return categoryCache.get(slug)!
    const found = await payload.find({
      collection: 'categories',
      where: { or: [{ slug: { equals: slug } }, { title: { equals: name } }] },
      limit: 1,
      depth: 0,
    })
    const id = found.docs[0]?.id ?? (await payload.create({ collection: 'categories', data: { title: name, slug } })).id
    categoryCache.set(slug, id)
    return id
  }

  // Photos: downloaded once, re-used if the same file was imported before
  const photoCache = new Map<string, number | string | null>()
  const photo = async (url: string, alt: string) => {
    if (photoCache.has(url)) return photoCache.get(url)!
    const file = decodeURIComponent(url.split('?')[0].split('/').pop() || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1, depth: 0 })
    if (existing.docs[0]) {
      photoCache.set(url, existing.docs[0].id)
      return existing.docs[0].id
    }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 PetWell product import' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = Buffer.from(await res.arrayBuffer())
      const ext = file.split('.').pop()!.toLowerCase()
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data, name: file, size: data.length, mimetype: res.headers.get('content-type') || MIME[ext] || 'image/jpeg' },
      })
      photoCache.set(url, doc.id)
      return doc.id
    } catch (err) {
      result.photoProblems.push(`${file}: ${(err as Error).message}`)
      photoCache.set(url, null)
      return null
    }
  }

  for (const [handle, group] of groups) {
    const first = group[0]
    const title = first.title || handle
    try {
      const variants = group.map((r) => ({
        option: r.option || undefined,
        secondOption: r.second_option || undefined,
        price: num(r.price) ?? 0,
        compareAtPrice: num(r.was_price),
        stock: num(r.stock),
        sku: r.sku || undefined,
      }))
      const missingPrice = group.some((r) => num(r.price) === undefined)

      const images: (number | string)[] = []
      for (const url of split(first.image_urls, '|')) {
        const id = await photo(url, title)
        if (id !== null) images.push(id)
      }

      const categories: (number | string)[] = []
      for (const name of split(first.category, '|')) categories.push(await categoryId(name))

      const wantsLive = (first.status || 'published').toLowerCase() !== 'draft'
      const status = wantsLive && !missingPrice ? 'published' : 'draft'
      if (status === 'draft') result.hidden.push(missingPrice ? `${title} (no price yet)` : title)

      const data = {
        title,
        slug: handle,
        brand: first.brand || undefined,
        intro: first.intro || undefined,
        benefits: split(first.benefits, '|').map((text) => ({ text })),
        details: split(first.details, '||').map((section) => {
          const i = section.indexOf(':')
          return i > 0 ? { heading: section.slice(0, i).trim(), text: section.slice(i + 1).trim() } : { heading: 'More information', text: section }
        }),
        optionName: first.option_name || 'Size',
        secondOptionName: first.second_option_name || undefined,
        variants,
        badge: first.badge || undefined,
        prescriptionRequired: yes(first.prescription_required),
        petRegistrationRequired: yes(first.pet_registration_required),
        status,
        ...(images.length ? { images } : {}),
        ...(categories.length ? { categories } : {}),
      }

      const existing = await payload.find({ collection: 'products', where: { slug: { equals: handle } }, limit: 1, depth: 0 })
      if (existing.docs[0]) {
        await payload.update({ collection: 'products', id: existing.docs[0].id, data: data as never })
        result.updated.push(title)
      } else {
        await payload.create({ collection: 'products', data: data as never })
        result.created.push(title)
      }
    } catch (err) {
      result.errors.push(`${title}: ${(err as Error).message}`)
    }
  }
  return result
}

export const TEMPLATE_HEADER =
  'handle,title,brand,category,option_name,option,second_option_name,second_option,price,was_price,stock,sku,intro,benefits,details,badge,prescription_required,pet_registration_required,image_urls,status'
