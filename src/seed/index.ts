import type { Payload } from 'payload'

import {
  categories,
  homepage,
  homepageRowProducts,
  pages,
  posts,
  products,
  settings,
  SHOPIFY_ARTICLES,
  SHOPIFY_FILES,
} from './data'
import { markdownToLexical } from './lexical'

type Id = number

const MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }

/**
 * Imports the Pet Well starter content: categories, products, homepage, articles, pages and settings.
 * Images are downloaded from the original Shopify CDN once and saved into your own media storage.
 */
export const seed = async (payload: Payload, { force = false } = {}) => {
  const log: string[] = []
  void force

  const imageCache = new Map<string, Id | null>()
  const upload = async (file: string, alt: string, base = SHOPIFY_FILES): Promise<Id | null> => {
    const key = base + file
    if (imageCache.has(key)) return imageCache.get(key)!
    // Re-use a photo imported on an earlier run.
    // (Storage may have renamed it, e.g. Dog.jpg → Dog-1.jpg.)
    const dot = file.lastIndexOf('.')
    const stem = file.slice(0, dot)
    const ext = file.slice(dot)
    const escape = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const sameFile = new RegExp(`^${escape(stem)}(-\\d+)?${escape(ext)}$`, 'i')
    const candidates = await payload.find({
      collection: 'media',
      where: { filename: { like: stem } },
      limit: 50,
      depth: 0,
      sort: 'createdAt',
    })
    const already = candidates.docs.find((d) => d.filename && sameFile.test(d.filename))
    if (already) {
      imageCache.set(key, already.id)
      return already.id
    }
    try {
      const res = await fetch(`${key}?width=2000`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = Buffer.from(await res.arrayBuffer())
      const ext = file.split('.').pop()!.toLowerCase()
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data, mimetype: MIME[ext] ?? 'image/jpeg', name: file, size: data.length },
      })
      imageCache.set(key, doc.id)
      return doc.id
    } catch (err) {
      log.push(`Could not import image ${file}: ${(err as Error).message}`)
      imageCache.set(key, null)
      return null
    }
  }

  // Categories
  const categoryIds: Record<string, Id> = {}
  for (const c of categories) {
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
    const image = await upload(c.image, c.title)
    const doc = found.docs[0]
      ? found.docs[0]
      : await payload.create({
          collection: 'categories',
          data: { title: c.title, slug: c.slug, sortOrder: c.sortOrder, showInFooter: true, image: image ?? undefined },
        })
    categoryIds[c.slug] = doc.id
  }

  // Products
  const productIds: Record<string, Id> = {}
  for (const p of products) {
    const found = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1, depth: 0 })
    const existingProduct = found.docs[0]
    if (existingProduct && (existingProduct.images?.length ?? 0) > 0) {
      productIds[p.slug] = existingProduct.id
      continue
    }
    const images: Id[] = []
    for (const f of p.images) {
      const id = await upload(f, p.title)
      if (id !== null) images.push(id)
    }
    if (existingProduct) {
      if (images.length) {
        await payload.update({ collection: 'products', id: existingProduct.id, data: { images: images as never } })
      }
      productIds[p.slug] = existingProduct.id
      continue
    }
    const doc = await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        status: 'published',
        images: images as never,
        intro: p.intro,
        benefits: p.benefits.map((text) => ({ text })),
        details: p.details,
        optionName: p.optionName ?? 'Size',
        secondOptionName: p.secondOptionName,
        variants: p.variants.map((v) => ({
          option: v.option || undefined,
          secondOption: v.secondOption,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          sku: v.sku,
          stock: v.stock,
        })),
        badge: p.badge,
        prescriptionRequired: Boolean(p.prescriptionRequired),
        petRegistrationRequired: Boolean(p.petRegistrationRequired),
        categories: p.categories.map((slug) => categoryIds[slug]).filter(Boolean) as never,
      },
    })
    productIds[p.slug] = doc.id
  }

  // Articles
  for (const post of posts) {
    const foundPost = await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } }, limit: 1, depth: 0 })
    const existingPost = foundPost.docs[0]
    if (existingPost?.image) continue
    const image = await upload(post.image, post.title, SHOPIFY_ARTICLES)
    if (existingPost) {
      if (image) await payload.update({ collection: 'posts', id: existingPost.id, data: { image } })
      continue
    }
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        image: image ?? undefined,
        status: 'published',
        content: markdownToLexical(post.markdown),
        shopLinkLabel: post.shopLinkLabel,
        shopLinkUrl: post.shopLinkUrl,
      },
    })
  }

  // Info pages
  for (const page of pages) {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1 })
    if (found.docs.length) continue
    await payload.create({
      collection: 'pages',
      data: { title: page.title, slug: page.slug, intro: page.intro, content: markdownToLexical(page.markdown) },
    })
  }

  // Homepage
  // On a fresh shop everything is filled in. Afterwards, re-running only fills
  // sections that are empty and adds missing phone photos – it never overwrites
  // changes made in the admin.
  const withImage = async <T extends { image: string; alt?: string; mobileImage?: string }>(items: T[], altKey: keyof T) => {
    const out = []
    for (const item of items) {
      const { image, alt, mobileImage, ...rest } = item
      const label = String(alt ?? item[altKey] ?? '')
      out.push({
        ...rest,
        image: (await upload(image, label)) ?? undefined,
        ...(mobileImage ? { mobileImage: (await upload(mobileImage, `${label} (phone)`)) ?? undefined } : {}),
      })
    }
    return out
  }

  const current = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  const isEmpty = (v: unknown) => !Array.isArray(v) || v.length === 0
  const rowProducts = homepageRowProducts.map((slug) => productIds[slug]).filter(Boolean)
  const homeData: Record<string, unknown> = {}

  if (isEmpty(current.heroSlides)) {
    homeData.heroSlides = (await withImage(homepage.heroSlides, 'heading')).filter((sl) => sl.image)
  } else {
    // Keep the client's slides; add phone photos and any starter slide that's missing.
    const slides = (current.heroSlides ?? []).map((sl) => ({ ...sl })) as Record<string, unknown>[]
    for (const seedSlide of homepage.heroSlides) {
      const match = slides.find((sl) => sl.heading === seedSlide.heading)
      if (match) {
        if (!match.link && seedSlide.link) match.link = seedSlide.link
        if (!match.mobileImage && seedSlide.mobileImage) {
          match.mobileImage = (await upload(seedSlide.mobileImage, `${seedSlide.heading} (phone)`)) ?? undefined
        }
      } else {
        const [added] = await withImage([seedSlide], 'heading')
        if (added.image) slides.push(added)
      }
    }
    homeData.heroSlides = slides
  }
  if (isEmpty(current.promoTiles)) homeData.promoTiles = await withImage(homepage.promoTiles, 'title')
  if (isEmpty(current.shopByPet)) {
    homeData.shopByPetHeading = current.shopByPetHeading || 'Shop by pet'
    homeData.shopByPet = await withImage(homepage.shopByPet, 'label')
  }
  if (isEmpty(current.infoBlocks)) homeData.infoBlocks = homepage.infoBlocks
  if (isEmpty(current.offers)) {
    homeData.offersHeading = current.offersHeading || 'Special offers'
    homeData.offers = await withImage(homepage.offers, 'title')
  }
  if (!current.featureBanner?.image) {
    homeData.featureBanner = {
      show: true,
      ...homepage.featureBanner,
      image: (await upload(homepage.featureBanner.image, 'Dog greeting a delivery at the door')) ?? undefined,
      bullets: homepage.featureBanner.bullets.map((text) => ({ text })),
    }
  }
  if (!current.imageBanner?.image) {
    const { mobileImage, ...banner } = homepage.imageBanner
    homeData.imageBanner = {
      show: true,
      ...banner,
      image: (await upload(banner.image, 'Dog in a winter coat on a frosty path')) ?? undefined,
      mobileImage: (await upload(mobileImage, 'Dog in a winter coat on a frosty path (phone)')) ?? undefined,
    }
  } else if (!current.imageBanner.mobileImage && homepage.imageBanner.mobileImage) {
    homeData.imageBanner = {
      ...current.imageBanner,
      mobileImage: (await upload(homepage.imageBanner.mobileImage, 'Dog in a winter coat on a frosty path (phone)')) ?? undefined,
    }
  }
  if (isEmpty(current.firstProductRow?.products)) {
    homeData.firstProductRow = { heading: 'Seasonal favourites', products: rowProducts, viewAllLink: '/collections/all' }
  }
  if (isEmpty(current.secondProductRow?.products)) {
    homeData.secondProductRow = { heading: 'Bestsellers', products: rowProducts, viewAllLink: '/collections/all' }
  }
  if (!current.blogHeading) homeData.blogHeading = 'Pet care hub'
  if (!current.newsletterHeading) {
    homeData.newsletterHeading = 'Sign up and get 10% off your first order'
    homeData.newsletterText = 'Be the first to hear about offers, new products and expert pet care advice.'
  }
  if (Object.keys(homeData).length) {
    await payload.updateGlobal({ slug: 'homepage', data: homeData as never })
  }

  // Store settings – only on a fresh shop, so later changes are never overwritten
  const currentSettings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (currentSettings.logo) {
    return finish()
  }
  const endsAt = new Date(Date.now() + settings.promo.daysFromNow * 86400000).toISOString()
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      storeName: settings.storeName,
      logo: (await upload(settings.logo, 'Pet Well')) ?? undefined,
      currency: 'gbp',
      pointsPerPound: 1,
      promo: { show: true, text: settings.promo.text, code: settings.promo.code, endsAt },
      saleBar: settings.saleBar,
      infoBar: settings.infoBar,
      usps: settings.usps as never,
      freeDeliveryThreshold: 49,
      standardDeliveryPrice: 3.99,
      expressDeliveryPrice: 6.99,
      shippingCountries: ['GB'],
      deliveryNote: '*UK mainland only. Exclusions apply.',
      phone: '0000 000 0000',
      openingHours: 'Monday – Friday: 9am – 5pm\nSaturday – Sunday: Closed',
      footerContactText: 'Our pet care team is here Monday to Friday, 9am–5pm.',
      footerColumns: [
        {
          heading: 'Help & support',
          links: [
            { label: 'Help centre', url: '/pages/help-centre' },
            { label: 'Contact us', url: '/pages/contact' },
            { label: 'Order status', url: '/order-status' },
            { label: 'Prescriptions', url: '/pages/prescriptions' },
          ],
        },
      ],
      copyright: '© {year} Pet Well. Registered in England & Wales. Company no. 00000000.',
    },
  })

  return finish()

  function finish() {
    const failed = log.length
    return {
      ok: true,
      message: `Done – products, articles, pages and homepage are up to date (nothing you changed was overwritten).${
        failed
          ? ` ${failed} photo(s) could not be saved. First problem: ${log[0]}. Fix it, then click again – it only adds what's missing.`
          : ''
      }`,
      log,
    }
  }
}
