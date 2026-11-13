import Link from 'next/link'
import React from 'react'

import type { Category, Post, SiteSetting } from '@/payload-types'

import { NewsletterForm } from '../NewsletterForm'

export const Footer = ({
  settings,
  categories,
  posts,
}: {
  settings: SiteSetting
  categories: Category[]
  posts: Post[]
}) => {
  const copyright = (settings.copyright || '').replace('{year}', String(new Date().getFullYear()))
  const extraColumns = settings.footerColumns ?? []
  const helpColumn = extraColumns[0]

  return (
    <footer className="site-footer">
      <div className="site-footer__signup">
        <div className="page-width">
          <div>
            <h3>Get 10% off your first order</h3>
            <p>Sign up for exclusive offers, pet care tips and new arrivals.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="page-width site-footer__cols">
        <div>
          <h4>{helpColumn?.heading || 'Help & support'}</h4>
          <ul>
            {(helpColumn?.links ?? []).map((l) => (
              <li key={l.id}>
                <Link href={l.url}>{l.label}</Link>
              </li>
            ))}
            {!helpColumn && (
              <>
                <li>
                  <Link href="/pages/contact">Contact us</Link>
                </li>
                <li>
                  <Link href="/order-status">Order status</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h4>Shopping with us</h4>
          <ul>
            {categories
              .filter((c) => c.showInFooter)
              .map((c) => (
                <li key={c.id}>
                  <Link href={`/collections/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4>Pet care advice</h4>
          <ul>
            {posts.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link href={`/blogs/news/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <p style={{ margin: 0 }}>{settings.footerContactText}</p>
          {settings.phone && <p style={{ margin: '8px 0 0' }}>{settings.phone}</p>}
          {settings.email && (
            <p style={{ margin: '4px 0 0' }}>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
        </div>
        {extraColumns.slice(1).map((col) => (
          <div key={col.id}>
            <h4>{col.heading}</h4>
            <ul>
              {(col.links ?? []).map((l) => (
                <li key={l.id}>
                  <Link href={l.url}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="page-width site-footer__bottom">{copyright}</div>
    </footer>
  )
}
