import { getPayloadClient } from '@/lib/payload'
import { seed } from '@/seed'

export const maxDuration = 300

/** Called by the "Import starter content" button on the admin dashboard. Staff only. */
export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return Response.json({ error: 'Please sign in to the admin first.' }, { status: 401 })

  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      {
        error:
          'Photo storage isn’t connected yet. In Vercel open Storage → Create → Blob, connect it to this project, redeploy, then click Import again.',
      },
      { status: 400 },
    )
  }

  try {
    const result = await seed(payload)
    if (!result.ok) return Response.json({ error: result.message }, { status: 400 })
    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/', 'layout')
    } catch {
      // ignore
    }
    return Response.json(result)
  } catch (err) {
    payload.logger.error({ err }, 'Seed failed')
    return Response.json({ error: `Import failed: ${(err as Error).message}` }, { status: 500 })
  }
}
