import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string }
  const clean = String(email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  const payload = await getPayloadClient()
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: clean } }, limit: 1 })
  if (!existing.docs.length) {
    await payload.create({ collection: 'subscribers', data: { email: clean } })
  }
  return Response.json({ ok: true })
}
