import type Stripe from 'stripe'

import type { Order, Product } from '@/payload-types'

import { getPayloadClient } from './payload'
import { getStripe } from './stripe'

const fromMinor = (amount: number | null | undefined) => Math.round(Number(amount ?? 0)) / 100

/**
 * Turns a paid Stripe Checkout session into an Order in the admin panel.
 * Safe to call more than once (from the webhook and from the thank-you page):
 * an order is only ever created once per checkout session.
 */
export const fulfilCheckoutSession = async (
  sessionId: string,
  stripeClient?: Pick<Stripe, 'checkout' | 'promotionCodes'>,
): Promise<Order | null> => {
  const payload = await getPayloadClient()

  const existing = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) return existing.docs[0]

  const stripe = stripeClient ?? getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product', 'shipping_cost.shipping_rate', 'total_details.breakdown'],
  })
  if (session.payment_status !== 'paid') return null

  const lineItems = session.line_items?.data ?? []
  const items: NonNullable<Order['items']> = []
  const stockUpdates = new Map<string, { productId: string; variantId: string; quantity: number }>()

  for (const li of lineItems) {
    const product = li.price?.product as Stripe.Product | undefined
    const meta = product?.metadata ?? {}
    const quantity = li.quantity ?? 1
    items.push({
      title: meta.title || product?.name || li.description || 'Item',
      option: meta.option || '',
      quantity,
      unitPrice: fromMinor(li.price?.unit_amount),
      lineTotal: fromMinor(li.amount_total),
      sku: meta.sku || '',
      product: meta.productId ? Number(meta.productId) || (meta.productId as never) : undefined,
      variantId: meta.variantId,
      prescriptionRequired: meta.rx === '1',
    })
    if (meta.productId && meta.variantId) {
      stockUpdates.set(meta.variantId, { productId: meta.productId, variantId: meta.variantId, quantity })
    }
  }

  const details = session.customer_details
  const shipping = session.collected_information?.shipping_details ?? null
  const address = shipping?.address ?? details?.address
  const shippingRate = session.shipping_cost?.shipping_rate as Stripe.ShippingRate | undefined
  let discountCode = ''
  const promo = session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code
  if (typeof promo === 'string') {
    try {
      discountCode = (await stripe.promotionCodes.retrieve(promo)).code
    } catch {
      discountCode = ''
    }
  } else if (promo && typeof promo === 'object') {
    discountCode = promo.code
  }
  const prescriptionId = session.metadata?.prescriptionId
  const hasRx = items.some((i) => i.prescriptionRequired)

  let order: Order
  try {
    order = await payload.create({
      collection: 'orders',
      data: {
        status: hasRx ? 'on-hold' : 'new',
        paymentStatus: 'paid',
        currency: (session.currency || 'gbp').toUpperCase(),
        items,
        subtotal: fromMinor(session.amount_subtotal),
        shippingCost: fromMinor(session.shipping_cost?.amount_total),
        discount: fromMinor(session.total_details?.amount_discount),
        total: fromMinor(session.amount_total),
        shippingMethod: shippingRate?.display_name ?? '',
        discountCode,
        customer: { name: details?.name ?? '', email: (details?.email ?? '').toLowerCase(), phone: details?.phone ?? '' },
        shippingAddress: {
          name: shipping?.name ?? details?.name ?? '',
          line1: address?.line1 ?? '',
          line2: address?.line2 ?? '',
          city: address?.city ?? '',
          state: address?.state ?? '',
          postcode: address?.postal_code ?? '',
          country: address?.country ?? '',
        },
        prescription: prescriptionId ? (Number(prescriptionId) || (prescriptionId as never)) : undefined,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent?.id ?? ''),
        notes: hasRx ? 'Contains prescription items – check the prescription before sending.' : undefined,
      },
    })
  } catch (err) {
    // A parallel call (webhook + thank-you page) may have created it a moment ago.
    const again = await payload.find({ collection: 'orders', where: { stripeSessionId: { equals: sessionId } }, limit: 1 })
    if (again.docs[0]) return again.docs[0]
    throw err
  }

  // Reduce stock for tracked variants.
  const byProduct = new Map<string, { variantId: string; quantity: number }[]>()
  for (const u of stockUpdates.values()) {
    byProduct.set(u.productId, [...(byProduct.get(u.productId) ?? []), u])
  }
  for (const [productId, updates] of byProduct) {
    try {
      const product = (await payload.findByID({ collection: 'products', id: productId, depth: 0 })) as Product
      let changed = false
      const variants = (product.variants ?? []).map((v) => {
        const u = updates.find((x) => x.variantId === v.id)
        if (u && typeof v.stock === 'number') {
          changed = true
          return { ...v, stock: Math.max(0, v.stock - u.quantity) }
        }
        return v
      })
      if (changed) await payload.update({ collection: 'products', id: productId, data: { variants }, depth: 0 })
    } catch (err) {
      payload.logger.error({ err, productId }, 'Could not update stock')
    }
  }

  if (prescriptionId) {
    try {
      await payload.update({ collection: 'prescriptions', id: prescriptionId, data: { customerEmail: details?.email ?? undefined } })
    } catch {
      // Not critical.
    }
  }

  return order
}

