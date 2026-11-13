'use client'

import React from 'react'

import { useCart, type CartItem } from '../cart/CartProvider'

export const AddToBasketButton = ({
  item,
  quantity = 1,
  disabled,
  className = 'btn btn--accent',
  children,
}: {
  item: Omit<CartItem, 'quantity'>
  quantity?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const { add } = useCart()
  return (
    <button type="button" className={className} disabled={disabled} onClick={() => add(item, quantity)}>
      {children ?? 'Add to basket'}
    </button>
  )
}
