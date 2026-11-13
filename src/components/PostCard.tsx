import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { ChevronIcon, ClockIcon } from './Icons'
import { Img } from './Img'

export const PostCard = ({ post }: { post: Post }) => (
  <article className="post-card">
    <Link href={`/blogs/news/${post.slug}`} aria-hidden tabIndex={-1}>
      <Img media={post.image} size="card" sizes="(max-width: 860px) 100vw, 420px" />
    </Link>
    <div className="post-card__body">
      <div className="post-card__meta">
        <ClockIcon /> {post.readTime ?? 3} min read
      </div>
      <h3>
        <Link href={`/blogs/news/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.excerpt && <p>{post.excerpt}</p>}
      <Link href={`/blogs/news/${post.slug}`} className="link-arrow">
        Read more <ChevronIcon size={12} />
      </Link>
    </div>
  </article>
)
