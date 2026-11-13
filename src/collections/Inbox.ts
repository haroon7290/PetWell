import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

const staffAccess = { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly }

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Contact messages' },
  admin: {
    useAsTitle: 'name',
    group: 'Customers',
    defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'],
    description: 'Messages sent from the Contact page. Reply by email, then mark them as Replied.',
  },
  access: staffAccess,
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', admin: { width: '33%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '33%' } },
        { name: 'phone', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'topic', type: 'text', admin: { width: '50%' } },
        { name: 'orderNumber', type: 'text', label: 'Order number', admin: { width: '50%' } },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: { position: 'sidebar', components: { Cell: '@/components/admin/StatusCell#StatusCell' } },
    },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Newsletter sign-ups' },
  admin: {
    useAsTitle: 'email',
    group: 'Customers',
    defaultColumns: ['email', 'createdAt'],
    description: 'Email addresses from the newsletter forms. Use "Export" to download them for your email tool.',
  },
  access: staffAccess,
  defaultSort: '-createdAt',
  fields: [{ name: 'email', type: 'email', required: true, unique: true }],
}
