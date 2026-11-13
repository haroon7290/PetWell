import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly } from '../access'
import { revalidateEverything } from '../lib/revalidate'
import { slugField } from '../lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'brand', 'variants', 'status', 'categories', 'updatedAt'],
    listSearchableFields: ['title', 'brand', 'variants.sku'],
    description:
      'Everything you sell. Click "Create new" to add a product: give it a name, photos, a price, then press Save.',
    preview: (doc) => (doc?.slug ? `/products/${doc.slug}` : null),
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [revalidateEverything], afterDelete: [revalidateEverything] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Basics',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Product name',
              required: true,
              admin: { placeholder: 'e.g. Orthopaedic Memory Foam Dog Bed' },
            },
            {
              name: 'brand',
              type: 'text',
              admin: { placeholder: 'e.g. Hearthpaw' },
            },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Photos',
              admin: {
                description: 'Drag photos here or click to upload. The first photo is the main one.',
              },
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Short description',
              admin: {
                description: 'One or two sentences shown near the price.',
              },
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Key benefits',
              labels: { singular: 'Benefit', plural: 'Benefits' },
              admin: { description: 'Shown as a bullet list.', initCollapsed: false },
              fields: [{ name: 'text', type: 'text', required: true, label: 'Benefit' }],
            },
            {
              name: 'details',
              type: 'array',
              label: 'More information',
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                description: 'Extra sections such as "Ingredients", "Feeding guide" or "Directions for use".',
              },
              fields: [
                { name: 'heading', type: 'text', required: true, admin: { placeholder: 'e.g. Feeding guide' } },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: '2. Prices & sizes',
          description:
            'Add one row per size or option. Products with just one option only need one row with a price.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'optionName',
                  type: 'text',
                  label: 'Option name',
                  defaultValue: 'Size',
                  admin: { width: '50%', description: 'e.g. Size, Pack size, Dog weight' },
                },
                {
                  name: 'secondOptionName',
                  type: 'text',
                  label: 'Second option name (optional)',
                  admin: { width: '50%', description: 'Only if needed, e.g. Colour' },
                },
              ],
            },
            {
              name: 'variants',
              type: 'array',
              label: 'Options & prices',
              labels: { singular: 'Option', plural: 'Options' },
              minRows: 1,
              required: true,
              defaultValue: [{}],
              admin: {
                components: {
                  RowLabel: '@/components/admin/VariantRowLabel#VariantRowLabel',
                  Cell: '@/components/admin/PriceCell#PriceCell',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'option',
                      type: 'text',
                      label: 'Option',
                      admin: { width: '50%', placeholder: 'e.g. 2kg (leave empty if only one)' },
                    },
                    {
                      name: 'secondOption',
                      type: 'text',
                      label: 'Second option',
                      admin: {
                        width: '50%',
                        placeholder: 'e.g. Grey',
                        condition: (data) => Boolean(data?.secondOptionName),
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Price (£)',
                      required: true,
                      min: 0,
                      admin: { width: '33%', step: 0.01 },
                    },
                    {
                      name: 'compareAtPrice',
                      type: 'number',
                      label: 'Was price (£)',
                      min: 0,
                      admin: {
                        width: '33%',
                        step: 0.01,
                        description: 'Optional. Shows the item as on sale.',
                      },
                    },
                    {
                      name: 'stock',
                      type: 'number',
                      label: 'Stock',
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Leave empty if you don’t track stock. Goes down automatically when orders are paid.',
                      },
                    },
                  ],
                },
                {
                  name: 'sku',
                  type: 'text',
                  label: 'Product code (SKU)',
                  admin: { description: 'Optional.' },
                },
              ],
            },
          ],
        },
        {
          label: '3. Labels & rules',
          fields: [
            {
              name: 'badge',
              type: 'text',
              label: 'Badge',
              admin: {
                description:
                  'Optional label on the product photo, e.g. Bestseller, New, 3 for 2. Sale percentages are added automatically.',
              },
            },
            {
              name: 'prescriptionRequired',
              type: 'checkbox',
              label: 'Prescription required',
              admin: {
                description: 'Customers must give their pet’s details and prescription before paying.',
              },
            },
            {
              name: 'petRegistrationRequired',
              type: 'checkbox',
              label: 'Pet registration required',
            },
          ],
        },
        {
          label: '4. Google (SEO)',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Page title in Google',
              admin: { description: 'Optional. Defaults to the product name.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Description in Google',
              admin: { description: 'Optional. Defaults to the short description.' },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Visibility',
      defaultValue: 'published',
      required: true,
      options: [
        { label: 'Live on website', value: 'published' },
        { label: 'Hidden (draft)', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Which category pages show this product.' },
    },
    slugField(),
  ],
}
