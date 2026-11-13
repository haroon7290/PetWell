import Link from 'next/link'
import React from 'react'

import { HeroSlider } from '@/components/home/HeroSlider'
import { CheckIcon, ChevronIcon, GiftIcon, HeartIcon, MailIcon, PillIcon, TruckIcon } from '@/components/Icons'
import { Img } from '@/components/Img'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PostCard } from '@/components/PostCard'
import { ProductCard } from '@/components/product/ProductCard'
import { asProducts, getHomepage, getPosts, getSettings } from '@/lib/data'

export const revalidate = 300

const infoIcon = (name?: string | null) =>
  name === 'gift' ? <GiftIcon size={20} /> : name === 'truck' ? <TruckIcon size={20} /> : name === 'heart' ? <HeartIcon size={20} /> : <PillIcon size={20} />

const ProductRow = ({
  heading,
  products,
  viewAllLink,
  currency,
}: {
  heading?: string | null
  products: ReturnType<typeof asProducts>
  viewAllLink?: string | null
  currency: string
}) =>
  products.length ? (
    <section className="section">
      <div className="page-width">
        <div className="section__head">
          <h2 className="section__title">{heading}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="link-arrow">
              View all <ChevronIcon size={12} />
            </Link>
          )}
        </div>
        <div className="product-grid scroll-row scroll-row--products">
          {products.slice(0, 5).map((p) => (
            <ProductCard key={p.id} product={p} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  ) : null

export default async function HomePage() {
  const [home, posts, settings] = await Promise.all([getHomepage(), getPosts(3), getSettings()])
  const currency = settings.currency || 'gbp'
  const fb = home.featureBanner
  const ib = home.imageBanner

  return (
    <>
      <HeroSlider slides={home.heroSlides ?? []} />

      {(home.promoTiles?.length ?? 0) > 0 && (
        <section className="section">
          <div className="page-width tiles scroll-row scroll-row--tiles">
            {home.promoTiles!.map((t) => (
              <Link key={t.id} href={t.link || '/collections/all'} className={`tile tile--${t.colour || 'orange'}`}>
                <Img media={t.image} className="tile__img" sizes="(max-width: 860px) 50vw, 260px" />
                <div className="tile__body">
                  <div className="tile__title">{t.title}</div>
                  {t.subtitle && <div className="tile__sub">{t.subtitle}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(home.shopByPet?.length ?? 0) > 0 && (
        <section className="section">
          <div className="page-width">
            <h2 className="section__title" style={{ marginBottom: 18 }}>
              {home.shopByPetHeading}
            </h2>
            <div className="tiles scroll-row scroll-row--pets">
              {home.shopByPet!.map((p) => (
                <Link key={p.id} href={p.link || '/collections/all'} className="pet-tile">
                  <Img media={p.image} sizes="(max-width: 860px) 50vw, 260px" />
                  <span>{p.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(home.infoBlocks?.length ?? 0) > 0 && (
        <section className="section">
          <div className="page-width info-blocks">
            {home.infoBlocks!.map((b) => (
              <div key={b.id} className={`info-block info-block--${b.colour || 'purple'}`}>
                <div className="info-block__icon">{infoIcon(b.icon)}</div>
                <div>
                  <h3>{b.heading}</h3>
                  {b.text && <p>{b.text}</p>}
                  {b.link && b.linkLabel && (
                    <Link href={b.link} className="link-arrow">
                      {b.linkLabel} <ChevronIcon size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(home.offers?.length ?? 0) > 0 && (
        <section className="section">
          <div className="page-width">
            <h2 className="section__title" style={{ marginBottom: 18 }}>
              {home.offersHeading}
            </h2>
            <div className="tiles tiles--3 scroll-row scroll-row--offers">
              {home.offers!.map((o) => (
                <Link key={o.id} href={o.link || '/collections/all'} className="offer">
                  <div className="offer__media">
                    {o.badge && (
                      <div className="badge-stack">
                        <span className="badge">{o.badge}</span>
                      </div>
                    )}
                    <Img media={o.image} sizes="(max-width: 860px) 50vw, 430px" />
                  </div>
                  <div className="offer__body">
                    <div className="offer__title">{o.title}</div>
                    {o.subtitle && <div className="offer__sub">{o.subtitle}</div>}
                    <span className="link-arrow">
                      Shop now <ChevronIcon size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {fb?.show && fb.heading && (
        <section className="section">
          <div className="page-width">
            <div className="feature-banner">
              <div className="feature-banner__content">
                {fb.eyebrow && <div className="feature-banner__eyebrow">{fb.eyebrow}</div>}
                <h2>{fb.heading}</h2>
                {(fb.bullets?.length ?? 0) > 0 && (
                  <ul>
                    {fb.bullets!.map((b) => (
                      <li key={b.id}>
                        <CheckIcon size={16} /> {b.text}
                      </li>
                    ))}
                  </ul>
                )}
                {fb.buttonLabel && fb.link && (
                  <Link href={fb.link} className="btn btn--accent">
                    {fb.buttonLabel}
                  </Link>
                )}
              </div>
              <Img media={fb.image} mobileMedia={fb.mobileImage} size="large" className="feature-banner__img" sizes="(max-width: 860px) 100vw, 660px" />
            </div>
          </div>
        </section>
      )}

      <ProductRow
        heading={home.firstProductRow?.heading}
        products={asProducts(home.firstProductRow?.products)}
        viewAllLink={home.firstProductRow?.viewAllLink}
        currency={currency}
      />

      {posts.length > 0 && (
        <section className="section section--alt">
          <div className="page-width">
            <div className="section__head">
              <h2 className="section__title">{home.blogHeading || 'Pet care hub'}</h2>
              <Link href="/blogs/news" className="link-arrow">
                Visit the hub <ChevronIcon size={12} />
              </Link>
            </div>
            <div className="post-grid scroll-row scroll-row--posts">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {ib?.show && ib.heading && (
        <section className="section">
          <div className="page-width">
            <div className="image-banner">
              <Img media={ib.image} mobileMedia={ib.mobileImage} size="large" sizes="100vw" className="image-banner__img" />
              <div className="image-banner__content">
                <h2>{ib.heading}</h2>
                {ib.text && <p>{ib.text}</p>}
                {ib.buttonLabel && ib.link && (
                  <Link href={ib.link} className="btn btn--accent" style={{ minWidth: 220 }}>
                    {ib.buttonLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <ProductRow
        heading={home.secondProductRow?.heading}
        products={asProducts(home.secondProductRow?.products)}
        viewAllLink={home.secondProductRow?.viewAllLink}
        currency={currency}
      />

      <section className="newsletter">
        <div className="page-width">
          <span style={{ color: 'var(--color-primary)', display: 'inline-block' }}>
            <MailIcon />
          </span>
          <h2>{home.newsletterHeading}</h2>
          <p>{home.newsletterText}</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
