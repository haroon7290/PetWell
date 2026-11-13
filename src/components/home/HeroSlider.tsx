'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

import type { Homepage } from '@/payload-types'

import { ChevronIcon } from '../Icons'
import { Img } from '../Img'

type Slide = NonNullable<Homepage['heroSlides']>[number]

export const HeroSlider = ({ slides }: { slides: Slide[] }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count < 2 || paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count, paused])

  if (!count) return null

  return (
    <section className="hero" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div className="hero__slide" key={s.id ?? i} aria-hidden={i !== index}>
            <Img media={s.image} mobileMedia={s.mobileImage} size="large" priority={i === 0} sizes="100vw" className="hero__img" />
            <div className="page-width" style={{ width: '100%' }}>
              <div className="hero__card">
                {s.eyebrow && <div className="hero__eyebrow">{s.eyebrow}</div>}
                <h2 className="hero__heading">{s.heading}</h2>
                {s.text && <p className="hero__text">{s.text}</p>}
                {s.buttonLabel && s.link && (
                  <Link href={s.link} className="btn btn--accent" tabIndex={i === index ? 0 : -1}>
                    {s.buttonLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={() => go(index - 1)} aria-label="Previous slide">
            <ChevronIcon dir="left" size={18} />
          </button>
          <button className="hero__arrow hero__arrow--next" onClick={() => go(index + 1)} aria-label="Next slide">
            <ChevronIcon size={18} />
          </button>
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button
                key={s.id ?? i}
                className="hero__dot"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
