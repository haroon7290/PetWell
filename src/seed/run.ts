/**
 * Command-line import: `npm run seed` (uses DATABASE_URL etc. from .env).
 * Most people should use the "Import starter content" button on the admin dashboard instead.
 */
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config')
const { seed } = await import('./index')

const payload = await getPayload({ config })
const result = await seed(payload, { force: process.argv.includes('--force') })
console.log(result.message)
for (const line of result.log ?? []) console.log(' -', line)
process.exit(result.ok ? 0 : 1)
