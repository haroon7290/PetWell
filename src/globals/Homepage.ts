import type { Field, GlobalConfig } from 'payload'

import { anyone, staffOnly } from '../access'
import { revalidateEverything } from '../lib/revalidate'

const link = (name = 'link', label = 'Link'): Field => ({
  name,
  type: 'text',
  label,
  admin: { description: 'e.g. /collections/dog or /products/joint-chews' },
})

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Content',
    description: 'Everything on the homepage, from top to bottom. Change text and photos, then press Save.',
  },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Big slideshow',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              label: 'Slides',
              labels: { singular: 'Slide', plural: 'Slides' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'eyebrow', type: 'text', label: 'Small heading', admin: { placeholder: 'e.g. Winter sale' } },
                { name: 'heading', type: 'text', required: true },
                { name: 'text', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'buttonLabel', type: 'text', label: 'Button text', admin: { width: '50%' } },
                    { ...link(), admin: { width: '50%' } } as Field,
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tiles',
          fields: [
            {
              name: 'promoTiles',
              type: 'array',
              label: 'Coloured tiles under the slideshow',
              labels: { singular: 'Tile', plural: 'Tiles' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '33%' } },
                    { name: 'subtitle', type: 'text', admin: { width: '33%' } },
                    {
                      name: 'colour',
                      type: 'select',
                      defaultValue: 'orange',
                      options: ['orange', 'blue', 'green', 'purple', 'pink'].map((v) => ({ label: v, value: v })),
                      admin: { width: '33%' },
                    },
                  ],
                },
                link(),
              ],
            },
            { name: 'shopByPetHeading', type: 'text', defaultValue: 'Shop by pet' },
            {
              name: 'shopByPet',
              type: 'array',
              label: 'Shop by pet tiles',
              labels: { singular: 'Pet', plural: 'Pets' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                    { ...link(), admin: { width: '50%' } } as Field,
                  ],
                },
              ],
            },
            {
              name: 'infoBlocks',
              type: 'array',
              label: 'Info boxes (prescriptions, rewards)',
              labels: { singular: 'Box', plural: 'Boxes' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      defaultValue: 'pill',
                      options: ['pill', 'gift', 'truck', 'heart'].map((v) => ({ label: v, value: v })),
                      admin: { width: '33%' },
                    },
                    {
                      name: 'colour',
                      type: 'select',
                      defaultValue: 'purple',
                      options: ['purple', 'orange', 'green', 'blue'].map((v) => ({ label: v, value: v })),
                      admin: { width: '33%' },
                    },
                  ],
                },
                { name: 'heading', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'linkLabel', type: 'text', label: 'Link text', admin: { width: '50%' } },
                    { ...link(), admin: { width: '50%' } } as Field,
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Offers & banners',
          fields: [
            { name: 'offersHeading', type: 'text', defaultValue: 'Special offers' },
            {
              name: 'offers',
              type: 'array',
              labels: { singular: 'Offer', plural: 'Offers' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  type: 'row',
                  fields: [
                    { name: 'badge', type: 'text', admin: { width: '33%', placeholder: 'e.g. 20% OFF' } },
                    { name: 'title', type: 'text', required: true, admin: { width: '33%' } },
                    { name: 'subtitle', type: 'text', admin: { width: '33%' } },
                  ],
                },
                link(),
              ],
            },
            {
              name: 'featureBanner',
              type: 'group',
              label: 'Green banner (Subscribe & Save)',
              fields: [
                { name: 'show', type: 'checkbox', defaultValue: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'eyebrow', type: 'text', label: 'Small heading' },
                { name: 'heading', type: 'text' },
                {
                  name: 'bullets',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'buttonLabel', type: 'text', label: 'Button text', admin: { width: '50%' } },
                    { ...link(), admin: { width: '50%' } } as Field,
                  ],
                },
              ],
            },
            {
              name: 'imageBanner',
              type: 'group',
              label: 'Photo banner (Winter wellness)',
              fields: [
                { name: 'show', type: 'checkbox', defaultValue: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'heading', type: 'text' },
                { name: 'text', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'buttonLabel', type: 'text', label: 'Button text', admin: { width: '50%' } },
                    { ...link(), admin: { width: '50%' } } as Field,
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Product rows',
          fields: [
            {
              name: 'firstProductRow',
              type: 'group',
              label: 'First product row',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Seasonal favourites' },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: { description: 'Pick the products to show, in order.' },
                },
                { ...link('viewAllLink', '"View all" link') } as Field,
              ],
            },
            {
              name: 'secondProductRow',
              type: 'group',
              label: 'Second product row',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Bestsellers' },
                { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
                { ...link('viewAllLink', '"View all" link') } as Field,
              ],
            },
            { name: 'blogHeading', type: 'text', label: 'Blog section heading', defaultValue: 'Pet care hub' },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            { name: 'newsletterHeading', type: 'text', defaultValue: 'Sign up and get 10% off your first order' },
            {
              name: 'newsletterText',
              type: 'text',
              defaultValue: 'Be the first to hear about offers, new products and expert pet care advice.',
            },
          ],
        },
      ],
    },
  ],
}
