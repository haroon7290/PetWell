'use client'

import React from 'react'

import { useCart } from '../cart/CartProvider'
import { BasketIcon } from '../Icons'

export const CartButton = () => {
  const { count, open } = useCart()
  return (
    <button type="button" className="header-icon" onClick={open} aria-label={`Basket, ${count} items`}>
      <BasketIcon size={22} />
      {count > 0 && <span className="header-icon__count">{count}</span>}
      Basket
    </button>
  )
}
