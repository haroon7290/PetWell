'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const NavLinks = ({ links }: { links: { label: string; href: string }[] }) => {
  const pathname = usePathname()
  return (
    <ul className="page-width">
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
        return (
          <li key={l.href}>
            <Link href={l.href} aria-current={active ? 'page' : undefined}>
              {l.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
