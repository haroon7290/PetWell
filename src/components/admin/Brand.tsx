import React from 'react'

const Paw = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <g fill="#F28C28">
      <ellipse cx="32" cy="42" rx="14" ry="12" />
      <ellipse cx="14" cy="28" rx="6" ry="8" />
      <ellipse cx="50" cy="28" rx="6" ry="8" />
      <ellipse cx="24" cy="15" rx="6" ry="8" />
      <ellipse cx="40" cy="15" rx="6" ry="8" />
    </g>
  </svg>
)

/** Shown on the admin login page. */
export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Paw size={44} />
    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 36, letterSpacing: '-0.5px' }}>
      <span style={{ color: '#F28C28' }}>Pet</span>
      <span style={{ color: '#1E5B4F' }}>Well</span>
    </span>
  </div>
)

/** Shown in the admin navigation. */
export const Icon = () => <Paw size={26} />
