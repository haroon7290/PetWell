import type Stripe from 'stripe'

import { getSettings } from '@/lib/data'
import { isInStock, variantLabel } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { getStripe, siteUrl } from '@/lib/stripe'
import type { Product } from '@/payload-types'

type Body = {
  items: { productId: number | string; variantId: string; quantity: number }[]
  prescriptionId?: number | string | null
}

const toMinor = (n: number) => Math.round(n * 100)

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ error: 'Your basket is empty.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const settings = await getSettings()
    const currency = settings.currency || 'gbp'
    const base = siteUrl(req)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let subtotal = 0
    let needsPrescription = false

    for (const item of body.items) {
      const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)))
      let product: Product
      try {
        product = (await payload.findByID({ collection: 'products', id: item.productId, depth: 1 })) as Product
      } catch {
        return Response.json({ error: 'A product in your basket is no longer available. Please remove it.' }, { status: 400 })
      }
      if (product.status !== 'published') {
        return Response.json({ error: `${product.title} is no longer available. Please remove it.` }, { status: 400 })
      }
      const variant = product.variants?.find((v) => v.id === item.variantId)
      if (!variant) {
        return Response.json({ error: `The option you chose for ${product.title} has changed. Please add it again.` }, { status: 400 })
      }
      if (!isInStock(variant) || (typeof variant.stock === 'number' && variant.stock < quantity)) {
        return Response.json(
          { error: `Sorry, we only have ${variant.stock ?? 0} of ${product.title} ${variantLabel(variant)} left.` },
          { status: 400 },
        )
      }
      if (product.prescriptionRequired) needsPrescription = true

      const option = variantLabel(variant)
      const image =
        product.images?.[0] && typeof product.images[0] === 'object' ? (product.images[0].sizes?.card?.url ?? product.images[0].url) : null
      const absoluteImage = image ? (image.startsWith('http') ? image : `${base}${image}`) : null

      subtotal += variant.price * quantity
      lineItems.push({
        quantity,
        price_data: {
          currency,
          unit_amount: toMinor(variant.price),
          product_data: {
            name: option ? `${product.title} – ${option}` : product.title,
            images: absoluteImage && absoluteImage.startsWith('https://') ? [absoluteImage] : undefined,
            metadata: {
              productId: String(product.id),
              variantId: String(variant.id),
              title: product.title,
              option,
              sku: variant.sku ?? '',
              rx: product.prescriptionRequired ? '1' : '0',
            },
          },
        },
      })
    }

    if (needsPrescription && !body.prescriptionId) {
      return Response.json(
        { error: 'Your basket contains prescription items. Please add your pet’s details and prescription first.' },
        { status: 400 },
      )
    }

    const threshold = settings.freeDeliveryThreshold ?? 0
    const free = threshold > 0 && subtotal >= threshold
    const standard = free ? 0 : (settings.standardDeliveryPrice ?? 0)
    const express = settings.expressDeliveryPrice ?? 0

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          display_name: free ? 'Free standard delivery' : 'Standard delivery',
          type: 'fixed_amount',
          fixed_amount: { amount: toMinor(standard), currency },
          delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 4 } },
        },
      },
    ]
    if (express > 0) {
      shippingOptions.push({
        shipping_rate_data: {
          display_name: 'Express (next working day)',
          type: 'fixed_amount',
          fixed_amount: { amount: toMinor(express), currency },
          delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 1 } },
        },
      })
    }

    const countries = (settings.shippingCountries?.length ? settings.shippingCountries : ['GB']) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: countries },
      shipping_options: shippingOptions,
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: body.prescriptionId ? { prescriptionId: String(body.prescriptionId) } : undefined,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cart`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error', err)
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
