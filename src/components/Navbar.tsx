'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/demo', label: 'Live Demo' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/constitution', label: 'Constitution' },
  { href: '/audit', label: 'Audit' },
  { href: '/create', label: 'Create' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="text-white font-black tracking-widest text-lg hover:text-cyan-400 transition-colors">
          SOVEREIGN
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className="relative px-4 py-2 text-xs tracking-wider transition-colors hover:text-white text-gray-400">
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-gray-800 rounded"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${active ? 'text-white' : ''}`}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">MANTLE NETWORK</div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>
    </nav>
  )
}
