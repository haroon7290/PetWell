import { revalidatePath } from 'next/cache'

/** After the client saves something, refresh every page so the change shows straight away. */
export const revalidateEverything = ({ doc }: { doc: unknown }) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next (e.g. seed script) – nothing to refresh.
  }
  return doc
}
