'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export const SortSelect = ({ value, options }: { value: string; options: { value: string; label: string }[] }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return (
    <label>
      Sort by
      <select
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('sort', e.target.value)
          router.push(`${pathname}?${params.toString()}`)
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
