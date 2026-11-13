'use client'

import React, { useEffect, useState } from 'react'

const format = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = String(Math.floor((s % 86400) / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${d}d ${h}:${m}:${sec}`
}

export const Countdown = ({ endsAt }: { endsAt: string }) => {
  const end = new Date(endsAt).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const t = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(t)
    }
  }, [])

  if (now !== null && end - now <= 0) return null
  return (
    <>
      <strong>Offer ends in:</strong>
      <span className="announce__timer" suppressHydrationWarning>
        {now === null ? '—' : format(end - now)}
      </span>
    </>
  )
}
