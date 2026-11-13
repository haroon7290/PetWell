import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

export const ORDER_STATUSES = [
  { label: 'New – to pack', value: 'new' },
  { label: 'Packing', value: 'processing' },
  { label: 'On hold (waiting for prescription)', value: 'on-hold' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
] as const

const readOnly = { readOnly: true }

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Order', plural: 'Orders' },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shop',
    defaultColumns: ['orderNumber', 'placedBy', 'total', 'status', 'createdAt'],
    listSearchableFields: ['orderNumber', 'placedBy', 'customer.email'],
    description:
      'Orders appear here automatically when a customer pays. Open an order, change its status as you pack and ship it, then press Save.',
  },
  access: {
    read: staffOnly,
    // Orders are only created automatically by Stripe checkout.
    create: () => false,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        if (operation === 'create' && !data.orderNumber) {
          const { totalDocs } = await req.payload.count({ collection: 'orders', req })
          data.orderNumber = `PW-${String(1001 + totalDocs)}`
        }
        if (data.customer && (data.customer.name || data.customer.email)) {
          data.placedBy = data.customer.name || data.customer.email
        }
        if (data.status === 'shipped' && originalDoc?.status !== 'shipped' && !data.tracking?.shippedAt) {
          data.tracking = { ...(data.tracking || {}), shippedAt: new Date().toISOString() }
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Items ordered',
              admin: { ...readOnly, components: { RowLabel: '@/components/admin/OrderItemRowLabel#OrderItemRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', label: 'Product', admin: { width: '45%' } },
                    { name: 'option', type: 'text', label: 'Option', admin: { width: '20%' } },
                    { name: 'quantity', type: 'number', label: 'Qty', admin: { width: '10%' } },
                    { name: 'unitPrice', type: 'number', label: 'Price (£)', admin: { width: '12%' } },
                    { name: 'lineTotal', type: 'number', label: 'Total (£)', admin: { width: '13%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'sku', type: 'text', label: 'SKU', admin: { width: '33%' } },
                    { name: 'product', type: 'relationship', relationTo: 'products', label: 'Open product', admin: { width: '33%' } },
                    { name: 'variantId', type: 'text', admin: { hidden: true } },
                    {
                      name: 'prescriptionRequired',
                      type: 'checkbox',
                      label: 'Prescription item',
                      admin: { width: '33%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', label: 'Items (£)', admin: { ...readOnly, width: '25%' } },
                { name: 'shippingCost', type: 'number', label: 'Delivery (£)', admin: { ...readOnly, width: '25%' } },
                { name: 'discount', type: 'number', label: 'Discount (£)', admin: { ...readOnly, width: '25%' } },
                { name: 'total', type: 'number', label: 'Total paid (£)', admin: { ...readOnly, width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'shippingMethod', type: 'text', label: 'Delivery method', admin: { ...readOnly, width: '50%' } },
                { name: 'discountCode', type: 'text', label: 'Discount code used', admin: { ...readOnly, width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Customer & address',
          fields: [
            {
              name: 'customer',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', admin: { width: '33%' } },
                    { name: 'email', type: 'email', admin: { width: '33%' } },
                    { name: 'phone', type: 'text', admin: { width: '33%' } },
                  ],
                },
              ],
            },
            {
              name: 'shippingAddress',
              type: 'group',
              label: 'Delivery address',
              fields: [
                { name: 'name', type: 'text', label: 'Recipient' },
                { name: 'line1', type: 'text', label: 'Address line 1' },
                { name: 'line2', type: 'text', label: 'Address line 2' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', label: 'Town / city', admin: { width: '33%' } },
                    { name: 'state', type: 'text', label: 'County / state', admin: { width: '33%' } },
                    { name: 'postcode', type: 'text', label: 'Postcode / ZIP', admin: { width: '33%' } },
                  ],
                },
                { name: 'country', type: 'text' },
              ],
            },
            {
              name: 'prescription',
              type: 'relationship',
              relationTo: 'prescriptions',
              admin: {
                description: 'Pet and prescription details sent by the customer (for prescription items).',
                condition: (data) => Boolean(data?.prescription),
              },
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              name: 'paymentStatus',
              type: 'select',
              defaultValue: 'paid',
              options: [
                { label: 'Paid', value: 'paid' },
                { label: 'Refunded', value: 'refunded' },
                { label: 'Unpaid', value: 'unpaid' },
              ],
              admin: readOnly,
            },
            { name: 'currency', type: 'text', defaultValue: 'GBP', admin: readOnly },
            {
              name: 'stripeSessionId',
              type: 'text',
              unique: true,
              index: true,
              label: 'Stripe checkout ID',
              admin: readOnly,
            },
            {
              name: 'stripePaymentIntentId',
              type: 'text',
              label: 'Stripe payment ID',
              admin: {
                ...readOnly,
                description: 'Search this ID in your Stripe dashboard to see or refund the payment.',
              },
            },
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Order number',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: ORDER_STATUSES.map((s) => ({ ...s })),
      admin: {
        position: 'sidebar',
        description: 'Update this as you pack and send the order.',
        components: { Cell: '@/components/admin/StatusCell#StatusCell' },
      },
    },
    {
      name: 'tracking',
      type: 'group',
      label: 'Delivery tracking',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'carrier', type: 'text', admin: { placeholder: 'e.g. Royal Mail, DPD' } },
        { name: 'trackingNumber', type: 'text', label: 'Tracking number' },
        { name: 'shippedAt', type: 'date', label: 'Shipped on', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'placedBy',
      type: 'text',
      label: 'Customer',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal notes',
      admin: { position: 'sidebar', description: 'Only staff can see this.' },
    },
  ],
}
