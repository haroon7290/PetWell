import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Messages, Subscribers } from './collections/Inbox'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages, Posts } from './collections/Posts'
import { PrescriptionFiles, Prescriptions } from './collections/Prescriptions'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URI || ''

// Addresses allowed to use the admin login: your main address plus Vercel's
// automatic addresses (production and preview deployments).
const trustedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  'http://localhost:3000',
]
  .filter((u): u is string => Boolean(u))
  .map((u) => u.replace(/\/$/, ''))

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || '',
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' – Pet Well admin',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Brand#Logo',
        Icon: '@/components/admin/Brand#Icon',
      },
    },
    dashboard: {
      widgets: [
        {
          slug: 'shop-overview',
          label: 'Shop overview',
          Component: '@/components/admin/ShopOverview#ShopOverview',
          minWidth: 'medium',
          maxWidth: 'full',
        },
        {
          slug: 'orders-to-ship',
          label: 'Orders to pack & ship',
          Component: '@/components/admin/OrdersToShip#OrdersToShip',
          minWidth: 'medium',
          maxWidth: 'full',
        },
      ],
      defaultLayout: () => [
        { widgetSlug: 'shop-overview', width: 'full' },
        { widgetSlug: 'orders-to-ship', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
  },
  collections: [
    Orders,
    Products,
    Categories,
    Prescriptions,
    PrescriptionFiles,
    Messages,
    Subscribers,
    Posts,
    Pages,
    Media,
    Users,
  ],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: databaseUrl },
    // Database tables are created by migrations (src/migrations), which run
    // automatically during every Vercel build (`npm run build`).
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: { disablePayloadAccessControl: true },
        'prescription-files': true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
