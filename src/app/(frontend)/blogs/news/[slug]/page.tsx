import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ClockIcon } from '@/components/Icons'
import { Img } from '@/components/Img'
import { getPostBySlug } from '@/lib/data'
import { imageUrl } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const image = imageUrl(post.image, 'large')
  return { title: post.title, description: post.excerpt ?? undefined, openGraph: image ? { images: [image] } : undefined }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="page-width" style={{ paddingBottom: 56 }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blogs/news">Pet care hub</Link> / <strong>{post.title}</strong>
      </nav>
      <article>
        <h1 className="page-title" style={{ maxWidth: 860 }}>
          {post.title}
        </h1>
        <div className="post-card__meta">
          <ClockIcon /> {post.readTime ?? 3} min read
          {post.publishedAt && <> · {new Date(post.publishedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}</>}
        </div>
        {post.image && typeof post.image === 'object' && (
          <div className="article-hero">
            <Img media={post.image} size="large" priority sizes="(max-width: 1000px) 100vw, 980px" />
          </div>
        )}
        <div className="prose">
          {post.content && <RichText data={post.content} />}
          {post.shopLinkLabel && post.shopLinkUrl && (
            <p>
              <Link href={post.shopLinkUrl} className="btn btn--accent" style={{ textDecoration: 'none', color: '#fff' }}>
                {post.shopLinkLabel}
              </Link>
            </p>
          )}
          <p style={{ fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>
            This article is general advice and doesn’t replace a consultation with your vet.
          </p>
        </div>
      </article>
    </div>
  )
}
