import React from 'react'

type P = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const SearchIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const HelpIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" />
    <circle cx="12" cy="17" r=".6" fill="currentColor" />
  </svg>
)
export const BasketIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
    <path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
  </svg>
)
export const UserIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)
export const TruckIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </svg>
)
export const PillIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)" />
    <path d="m9.5 9.5 5 5" />
  </svg>
)
export const ShieldIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
export const GiftIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="8" width="18" height="4" />
    <path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3 8 4.5 9 8 12 8zM12 8s1.5-5 4-3.5S15 8 12 8z" />
  </svg>
)
export const HeartIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
)
export const TagIcon = ({ size = 15 }: P) => (
  <svg {...base(size)}>
    <path d="M3 12V3h9l9 9-9 9z" />
    <circle cx="7.5" cy="7.5" r="1.3" />
  </svg>
)
export const CheckIcon = ({ size = 14 }: P) => (
  <svg {...base(size)}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)
export const ChevronIcon = ({ size = 14, dir = 'right' }: P & { dir?: 'right' | 'left' | 'down' }) => (
  <svg {...base(size)} style={{ transform: dir === 'left' ? 'rotate(180deg)' : dir === 'down' ? 'rotate(90deg)' : undefined }}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)
export const ClockIcon = ({ size = 13 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
export const MailIcon = ({ size = 26 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
export const ReturnIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </svg>
)
export const ChatIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M4 5h16v11H8l-4 4z" />
  </svg>
)
export const LinkIcon = ({ size = 13 }: P) => (
  <svg {...base(size)}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)
export const MenuIcon = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Paw = ({ size = 26 }: P) => (
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

export const iconByName = (name: string | null | undefined, size = 16) => {
  switch (name) {
    case 'pill':
      return <PillIcon size={size} />
    case 'stars':
      return <span className="stars">★★★★★</span>
    case 'shield':
      return <ShieldIcon size={size} />
    case 'gift':
      return <GiftIcon size={size} />
    case 'heart':
      return <HeartIcon size={size} />
    default:
      return <TruckIcon size={size} />
  }
}
