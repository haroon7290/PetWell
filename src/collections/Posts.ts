import type { CollectionConfig } from 'payload'

import { anyone, publishedOrStaff, staffOnly } from '../access'
import { revalidateEverything } from '../lib/revalidate'
import { slugField } from '../lib/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Pet care hub articles' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'publishedAt'],
    description: 'Articles for the Pet care hub (blog).',
    preview: (doc) => (doc?.slug ? `/blogs/news/${doc.slug}` : null),
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-publishedAt',
  hooks: { afterChange: [revalidateEverything], afterDelete: [revalidateEverything] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Main photo' },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Summary',
      admin: { description: 'Shown on the homepage and blog list.' },
    },
    { name: 'content', type: 'richText', label: 'Article' },
    {
      type: 'row',
      fields: [
        {
          name: 'shopLinkLabel',
          type: 'text',
          label: 'Button text at the end (optional)',
          admin: { width: '50%', placeholder: 'e.g. Shop cat healthcare' },
        },
        {
          name: 'shopLinkUrl',
          type: 'text',
          label: 'Button link',
          admin: { width: '50%', placeholder: 'e.g. /collections/cat' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      required: true,
      options: [
        { label: 'Live on website', value: 'published' },
        { label: 'Hidden (draft)', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'readTime',
      type: 'number',
      label: 'Reading time (minutes)',
      defaultValue: 3,
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Information pages such as Help centre, Delivery, Prescriptions or Rewards. They appear at /pages/web-address.',
    preview: (doc) => (doc?.slug ? `/pages/${doc.slug}` : null),
  },
  access: {
    read: anyone,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: { afterChange: [revalidateEverything], afterDelete: [revalidateEverything] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea', label: 'Intro text' },
    { name: 'content', type: 'richText' },
    slugField(),
  ],
}
