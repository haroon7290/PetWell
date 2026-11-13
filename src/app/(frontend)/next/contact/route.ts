import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string>
  const email = String(body.email || '').trim()
  const message = String(body.message || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (message.length < 2) return Response.json({ error: 'Please write a message.' }, { status: 400 })

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'messages',
    data: {
      name: String(body.name || '').slice(0, 200),
      email,
      phone: String(body.phone || '').slice(0, 50),
      orderNumber: String(body.orderNumber || '').slice(0, 50),
      topic: String(body.topic || '').slice(0, 100),
      message: message.slice(0, 5000),
      status: 'new',
    },
  })
  return Response.json({ ok: true })
}
