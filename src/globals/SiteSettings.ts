import type { GlobalConfig } from 'payload'

import { anyone, staffOnly } from '../access'
import { revalidateEverything } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Store settings',
  admin: {
    group: 'Settings',
    description: 'Logo, top banners, delivery prices and contact details used across the whole website.',
  },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'storeName', type: 'text', defaultValue: 'Pet Well', required: true },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Transparent PNG or SVG works best.' },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'gbp',
              options: [
                { label: '£ Pound sterling (GBP)', value: 'gbp' },
                { label: '$ US dollar (USD)', value: 'usd' },
              ],
              admin: { description: 'The currency your prices are in and customers pay in.' },
            },
            {
              name: 'pointsPerPound',
              type: 'number',
              label: 'Reward points per £1',
              defaultValue: 1,
              admin: { description: 'Used for the "Earn X points" line on product pages. Set 0 to hide it.' },
            },
          ],
        },
        {
          label: 'Top banners',
          fields: [
            {
              name: 'promo',
              type: 'group',
              label: 'Dark promo bar',
              fields: [
                { name: 'show', type: 'checkbox', defaultValue: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'text', type: 'text', defaultValue: 'Save an extra 10% sitewide with code', admin: { width: '60%' } },
                    { name: 'code', type: 'text', defaultValue: 'PETWELL10', admin: { width: '40%', description: 'Create the same code in Stripe → Product catalogue → Coupons.' } },
                  ],
                },
                {
                  name: 'endsAt',
                  type: 'date',
                  label: 'Countdown ends',
                  admin: {
                    description: 'Optional. Shows "Offer ends in" with a live countdown.',
                    date: { pickerAppearance: 'dayAndTime' },
                  },
                },
              ],
            },
            {
              name: 'saleBar',
              type: 'group',
              label: 'Orange sale bar',
              fields: [
                { name: 'show', type: 'checkbox', defaultValue: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'boldText', type: 'text', defaultValue: 'Winter Sale:', admin: { width: '30%' } },
                    { name: 'text', type: 'text', defaultValue: 'up to 20% off pet essentials', admin: { width: '40%' } },
                    { name: 'link', type: 'text', defaultValue: '/collections/all', admin: { width: '30%' } },
                  ],
                },
              ],
            },
            {
              name: 'infoBar',
              type: 'group',
              label: 'Light info bar',
              fields: [
                { name: 'show', type: 'checkbox', defaultValue: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'boldText', type: 'text', defaultValue: 'Next day delivery', admin: { width: '40%' } },
                    { name: 'text', type: 'text', defaultValue: 'available on prescriptions*', admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'usps',
              type: 'array',
              label: 'Trust strip (under the menu)',
              labels: { singular: 'Item', plural: 'Items' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      defaultValue: 'truck',
                      options: ['truck', 'pill', 'stars', 'shield', 'gift', 'heart'].map((v) => ({ label: v, value: v })),
                      admin: { width: '20%' },
                    },
                    { name: 'boldText', type: 'text', admin: { width: '35%' } },
                    { name: 'text', type: 'text', admin: { width: '45%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Delivery',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'freeDeliveryThreshold', type: 'number', label: 'Free delivery over (£)', defaultValue: 49, admin: { width: '33%' } },
                { name: 'standardDeliveryPrice', type: 'number', label: 'Standard delivery (£)', defaultValue: 3.99, admin: { width: '33%' } },
                { name: 'expressDeliveryPrice', type: 'number', label: 'Express delivery (£)', defaultValue: 6.99, admin: { width: '33%' } },
              ],
            },
            {
              name: 'shippingCountries',
              type: 'select',
              hasMany: true,
              label: 'Countries you deliver to',
              defaultValue: ['GB'],
              options: [
                { label: 'United Kingdom', value: 'GB' },
                { label: 'United States', value: 'US' },
                { label: 'Ireland', value: 'IE' },
              ],
            },
            {
              name: 'deliveryNote',
              type: 'text',
              defaultValue: '*UK mainland only. Exclusions apply.',
            },
          ],
        },
        {
          label: 'Contact & footer',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', defaultValue: '0000 000 0000', admin: { width: '50%' } },
                { name: 'email', type: 'email', admin: { width: '50%' } },
              ],
            },
            { name: 'openingHours', type: 'textarea', defaultValue: 'Monday – Friday: 9am – 5pm\nSaturday – Sunday: Closed' },
            { name: 'footerContactText', type: 'text', defaultValue: 'Our pet care team is here Monday to Friday, 9am–5pm.' },
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Footer link columns',
              labels: { singular: 'Column', plural: 'Columns' },
              admin: { description: 'The category list is added to the footer automatically.' },
              fields: [
                { name: 'heading', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'url', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'copyright',
              type: 'text',
              defaultValue: '© {year} Pet Well. Registered in England & Wales. Company no. 00000000.',
              admin: { description: '{year} is replaced with the current year.' },
            },
          ],
        },
      ],
    },
  ],
}
