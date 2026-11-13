/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

import type { SiteSetting } from '@/payload-types'
import { imageUrl } from '@/lib/format'

import { HelpIcon, iconByName, LinkIcon, Paw, SearchIcon, TagIcon, UserIcon } from '../Icons'
import { CartButton } from './CartButton'
import { Countdown } from './Countdown'
import { NavLinks } from './NavLinks'

export const Logo = ({ settings }: { settings: SiteSetting }) => {
  const url = imageUrl(settings.logo, 'card')
  if (url) return <img src={url} alt={settings.storeName || 'Pet Well'} />
  return (
    <span className="logo-text">
      <Paw size={30} />
      <span>
        <span className="logo-text__pet">Pet</span>
        <span className="logo-text__well">Well</span>
      </span>
    </span>
  )
}

export const Header = ({ settings }: { settings: SiteSetting }) => {
  const { promo, saleBar, infoBar, usps } = settings
  return (
    <>
      <div className="announce">
        {promo?.show && (
          <div className="announce__bar announce__bar--dark">
            <TagIcon />
            <span>
              {promo.text} {promo.code && <strong>{promo.code}</strong>}
            </span>
            {promo.endsAt && <Countdown endsAt={promo.endsAt} />}
          </div>
        )}
        {saleBar?.show && (
          <Link href={saleBar.link || '/collections/all'} className="announce__bar announce__bar--orange">
            <span>
              <strong>{saleBar.boldText}</strong> {saleBar.text}
            </span>
          </Link>
        )}
        {infoBar?.show && (
          <div className="announce__bar announce__bar--light">
            <LinkIcon />
            <span>
              <strong>{infoBar.boldText}</strong> {infoBar.text}
            </span>
          </div>
        )}
      </div>

      <header className="site-header">
        <div className="page-width site-header__top">
          <Link href="/" className="site-header__logo" aria-label={`${settings.storeName} home`}>
            <Logo settings={settings} />
          </Link>
          <form className="search" action="/search" role="search">
            <label htmlFor="site-search" className="visually-hidden">
              Search
            </label>
            <input id="site-search" type="search" name="q" placeholder="Search products, brands and medicines" />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          <div className="header-icons">
            <Link href="/pages/contact" className="header-icon header-icon--desktop">
              <HelpIcon />
              Help
            </Link>
            <Link href="/order-status" className="header-icon header-icon--desktop">
              <UserIcon />
              My order
            </Link>
            <CartButton />
          </div>
        </div>
        <nav className="main-nav" aria-label="Main">
          <NavLinks
            links={[
              { label: 'Home', href: '/' },
              { label: 'Catalog', href: '/collections/all' },
              { label: 'Pet care hub', href: '/blogs/news' },
              { label: 'Contact', href: '/pages/contact' },
            ]}
          />
        </nav>
      </header>

      {usps && usps.length > 0 && (
        <div className="usp">
          <ul className="page-width">
            {usps.map((u) => (
              <li key={u.id}>
                {iconByName(u.icon, 15)}
                <span>
                  <strong>{u.boldText}</strong> {u.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
