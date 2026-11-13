import type Stripe from 'stripe'

import { fulfilCheckoutSession } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import { getStripe } from '@/lib/stripe'

/**
 * Stripe calls this URL when a payment completes or is refunded.
 * Set it up in Stripe → Developers → Webhooks → Add endpoint:
 *   https://YOUR-SITE/next/stripe-webhook
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return Response.json({ error: 'STRIPE_WEBHOOK_SECRET is not set' }, { status: 500 })

  const signature = req.headers.get('stripe-signature') ?? ''
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret)
  } catch (err) {
    return Response.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await fulfilCheckoutSession(event.data.object.id)
        break
      case 'charge.refunded': {
        const charge = event.data.object
        const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id
        if (paymentIntent && charge.refunded) {
          const payload = await getPayloadClient()
          await payload.update({
            collection: 'orders',
            where: { stripePaymentIntentId: { equals: paymentIntent } },
            data: { paymentStatus: 'refunded', status: 'refunded' },
          })
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handling failed', err)
    return Response.json({ error: 'Webhook handling failed' }, { status: 500 })
  }

  return Response.json({ received: true })
}
