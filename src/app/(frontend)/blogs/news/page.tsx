import Link from 'next/link'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import { getPosts } from '@/lib/data'

export const metadata = { title: 'Pet care hub' }

export default async function BlogPage() {
  const posts = await getPosts(60)
  return (
    <div className="page-width" style={{ paddingBottom: 48 }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>Pet care hub</strong>
      </nav>
      <h1 className="page-title">Pet care hub</h1>
      <p style={{ marginTop: -8, color: 'var(--color-muted)' }}>Expert advice to keep your pets happy and healthy.</p>
      <div className="post-grid">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
