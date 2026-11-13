import Stripe from 'stripe'

let client: Stripe | null = null

export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Payments are not set up yet: STRIPE_SECRET_KEY is missing.')
  if (!client) client = new Stripe(key)
  return client
}

export const siteUrl = (req?: Request) => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')
  if (req) return new URL(req.url).origin
  return 'http://localhost:3000'
}
