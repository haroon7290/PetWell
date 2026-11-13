import type { CollectionConfig } from 'payload'

import { anyone, staffOnly } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    group: 'Content',
    description: 'All photos used on the website. You can also upload photos directly from a product.',
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description (for accessibility and Google)',
      admin: {
        description: 'Describe the photo in a few words, e.g. "Golden retriever on a grey dog bed".',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'large', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
