import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { getPageBySlug } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  return page ? { title: page.title, description: page.intro ?? undefined } : {}
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <div className="page-width" style={{ paddingBottom: 56 }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>{page.title}</strong>
      </nav>
      <h1 className="page-title">{page.title}</h1>
      <div className="prose">
        {page.intro && <p style={{ fontSize: 18 }}>{page.intro}</p>}
        {page.content && <RichText data={page.content} />}
      </div>
    </div>
  )
}
