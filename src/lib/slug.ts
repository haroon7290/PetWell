import type { FieldHook, TextField } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim().length > 0) return slugify(value)
    const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    if (typeof source === 'string') return slugify(source)
    return value
  }

/** A web-address field that fills itself in from the title. */
export const slugField = (fallbackField = 'title'): TextField => ({
  name: 'slug',
  type: 'text',
  label: 'Web address',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Filled in automatically from the name. Only change it if you need to.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})
