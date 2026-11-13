import type { CollectionConfig } from 'payload'

import { anyone, staffOnly } from '../access'
import { revalidateEverything } from '../lib/revalidate'
import { slugField } from '../lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'slug', 'showInFooter'],
    description: 'Groups of products, e.g. Dog, Cat, Horses. Each category gets its own page on the website.',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: 'sortOrder',
  hooks: { afterChange: [revalidateEverything], afterDelete: [revalidateEverything] },
  fields: [
    { name: 'title', type: 'text', label: 'Name', required: true },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional short text shown at the top of the category page.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    slugField(),
    {
      name: 'showInFooter',
      type: 'checkbox',
      label: 'Show in the footer menu',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Order',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
