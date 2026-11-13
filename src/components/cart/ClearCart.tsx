'use client'

import { useEffect } from 'react'

import { useCart } from './CartProvider'

/** Empties the basket once the thank-you page loads. */
export const ClearCart = () => {
  const { clear } = useCart()
  useEffect(() => {
    clear()
  }, [clear])
  return null
}
