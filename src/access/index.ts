import type { Access } from 'payload'

/** Anyone can read (used for products, blog posts, images…). */
export const anyone: Access = () => true

/** Only signed-in staff (admin panel users). */
export const staffOnly: Access = ({ req }) => Boolean(req.user)

/** Public visitors only see published items; staff see everything. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}
