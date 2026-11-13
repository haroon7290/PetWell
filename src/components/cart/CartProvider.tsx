'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: number | string
  variantId: string
  slug: string
  title: string
  brand?: string | null
  option: string
  price: number
  image?: string | null
  prescriptionRequired?: boolean
  quantity: number
}

export type PrescriptionInfo = { id: number | string; petName: string }

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  hasPrescriptionItems: boolean
  prescription: PrescriptionInfo | null
  setPrescription: (p: PrescriptionInfo | null) => void
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  update: (variantId: string, quantity: number) => void
  remove: (variantId: string) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  freeDeliveryThreshold: number
  currency: string
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'petwell-cart-v1'

export const CartProvider = ({
  children,
  freeDeliveryThreshold,
  currency,
}: {
  children: React.ReactNode
  freeDeliveryThreshold: number
  currency: string
}) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [prescription, setPrescription] = useState<PrescriptionInfo | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load the saved basket after the first render (localStorage isn't available on the server).
  useEffect(() => {
    const load = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          setItems(Array.isArray(parsed.items) ? parsed.items : [])
          setPrescription(parsed.prescription ?? null)
        }
      } catch {
        // Storage unavailable – start with an empty basket.
      }
      setLoaded(true)
    }
    const t = setTimeout(load, 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, prescription }))
    } catch {
      // Ignore storage errors (private mode etc.).
    }
  }, [items, prescription, loaded])

  const add = useCallback<CartContextValue['add']>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId)
      if (existing) {
        return prev.map((i) => (i.variantId === item.variantId ? { ...i, ...item, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...item, quantity }]
    })
    setOpen(true)
  }, [])

  const update = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0 ? prev.filter((i) => i.variantId !== variantId) : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
    )
  }, [])

  const remove = useCallback((variantId: string) => setItems((prev) => prev.filter((i) => i.variantId !== variantId)), [])
  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setItems([])
    setPrescription(null)
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0)
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0)
    return {
      items,
      count,
      subtotal,
      hasPrescriptionItems: items.some((i) => i.prescriptionRequired),
      prescription,
      setPrescription,
      add,
      update,
      remove,
      clear,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      freeDeliveryThreshold,
      currency,
    }
  }, [items, prescription, add, update, remove, clear, isOpen, freeDeliveryThreshold, currency])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
