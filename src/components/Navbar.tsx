'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/demo', label: 'Decision Engine' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/constitution', label: 'Constitution' },
  { href: '/audit', label: 'Audit' },
  { href: '/create', label: 'Deploy' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-[#1C2333] bg-[#0B0F1A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-14">
        <Link href="/" className="text-[#E6EAF2] font-bold tracking-[0.2em] text-sm hover:text-white transition-colors">
          SOVEREIGN
        </Link>

        <div className="flex items-center">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-[12px] font-mono tracking-wide transition-colors ${
                  active ? 'text-[#E6EAF2]' : 'text-[#5A6680] hover:text-[#8AA0FF]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2]" />
          <span className="text-[#5A6680] text-[11px] tracking-widest">MANTLE MAINNET</span>
        </div>
      </div>
    </nav>
  )
}
