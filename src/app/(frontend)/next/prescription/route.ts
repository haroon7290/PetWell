import { getPayloadClient } from '@/lib/payload'

const MAX_BYTES = 4 * 1024 * 1024 // Vercel limits uploads to about 4.5 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const petName = String(form.get('petName') || '').trim()
    const ownerName = String(form.get('ownerName') || '').trim()
    const sendingSeparately = form.get('sendingSeparately') === 'on'
    const file = form.get('file')

    if (!petName || !ownerName) return Response.json({ error: 'Please fill in your name and your pet’s name.' }, { status: 400 })

    const payload = await getPayloadClient()
    let fileId: number | string | undefined

    if (!sendingSeparately) {
      if (!(file instanceof File) || file.size === 0) {
        return Response.json({ error: 'Please choose your prescription file.' }, { status: 400 })
      }
      if (file.size > MAX_BYTES) return Response.json({ error: 'The file is too big. Please upload a file under 4 MB.' }, { status: 400 })
      if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
        return Response.json({ error: 'Please upload a photo or a PDF.' }, { status: 400 })
      }
      const uploaded = await payload.create({
        collection: 'prescription-files',
        data: {},
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          size: file.size,
        },
      })
      fileId = uploaded.id
    }

    const doc = await payload.create({
      collection: 'prescriptions',
      data: {
        petName,
        ownerName,
        species: String(form.get('species') || ''),
        vetPractice: String(form.get('vetPractice') || ''),
        sendingSeparately,
        file: fileId as never,
        status: 'pending',
      },
    })

    return Response.json({ id: doc.id, petName: doc.petName })
  } catch (err) {
    console.error('Prescription upload failed', err)
    return Response.json({ error: 'Could not save the prescription. Please try again.' }, { status: 500 })
  }
}
