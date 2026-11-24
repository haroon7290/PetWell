import { revalidatePath } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import { importProducts, TEMPLATE_HEADER } from '@/lib/productImport'

export const maxDuration = 300

/** Staff only: bulk-create or update products from an uploaded CSV file. */
export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return Response.json({ error: 'Please sign in to the admin first.' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: 'Please choose a CSV file.' }, { status: 400 })
  if (file.size > 3 * 1024 * 1024) return Response.json({ error: 'The file is too big (max 3 MB).' }, { status: 400 })

  const result = await importProducts(payload, await file.text())
  try {
    revalidatePath('/', 'layout')
  } catch {
    // ignore
  }
  return Response.json(result, { status: result.errors.length && !result.created.length && !result.updated.length ? 400 : 200 })
}

/** Download an empty template with an example row. */
export async function GET() {
  const example =
    'example-dog-shampoo,Gentle Oatmeal Dog Shampoo,Brand name,Dog,Size,250ml,,,7.99,9.99,25,SKU-250,"Short description shown near the price.","First benefit|Second benefit","How to use: Wet coat, lather, rinse.||Ingredients: Water, oatmeal",New,no,no,https://example.com/photo1.jpg|https://example.com/photo2.jpg,published\n' +
    'example-dog-shampoo,,,,,500ml,,,12.99,,10,SKU-500,,,,,,,,\n'
  return new Response(`${TEMPLATE_HEADER}\n${example}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="petwell-products-template.csv"',
    },
  })
}
