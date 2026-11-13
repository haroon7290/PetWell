import type { Metadata } from 'next'
import React from 'react'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getCategories, getPosts, getSettings } from '@/lib/data'

import './globals.css'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings.storeName || 'Pet Well'
  return {
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL) : undefined,
    title: { default: name, template: `%s – ${name}` },
    description: 'Food, healthcare and accessories for every pet. Free delivery over £49.',
    openGraph: { siteName: name, type: 'website' },
  }
}

export const viewport = { themeColor: '#1E5B4F' }

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, posts] = await Promise.all([getSettings(), getCategories(), getPosts(4)])

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <CartProvider freeDeliveryThreshold={settings.freeDeliveryThreshold ?? 0} currency={settings.currency || 'gbp'}>
          <Header settings={settings} />
          <main id="main">{children}</main>
          <Footer settings={settings} categories={categories} posts={posts} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
