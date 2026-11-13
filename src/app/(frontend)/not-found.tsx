import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="page-width">
      <div className="success-box">
        <div style={{ fontSize: 44 }}>🐾</div>
        <h1 style={{ fontSize: 28 }}>Page not found</h1>
        <p>Sorry, we couldn’t find that page. It may have moved.</p>
        <Link href="/collections/all" className="btn btn--accent">
          Browse all products
        </Link>
      </div>
    </div>
  )
}
