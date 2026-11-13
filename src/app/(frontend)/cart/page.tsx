import Link from 'next/link'
import React from 'react'

import { CartPage } from '@/components/cart/CartPage'

export const metadata = { title: 'Your basket' }

export default function BasketPage() {
  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <strong>Basket</strong>
      </nav>
      <h1 className="page-title">Your basket</h1>
      <CartPage />
    </div>
  )
}
