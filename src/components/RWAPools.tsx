'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Pool {
  id: string
  name: string
  protocol: string
  asset: string
  type: string
  apy: number
  tvl: number
  risk: number
  description: string
  constitutionCompliant: boolean
  rwaScore: number
}

export default function RWAPools() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/byreal')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPools(d.pools)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(1)}M`
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(0)}K`
    return `$${tvl}`
  }

  if (loading) {
    return (
      <div className="border border-gray-700 bg-gray-900 rounded-xl p-4">
        <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">RWA POOLS — MANTLE</div>
        <motion.div className="text-gray-600 text-xs text-center py-2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          Loading RWA pools...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="border border-gray-700 bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-gray-400 text-xs font-bold tracking-widest">RWA POOLS — MANTLE</div>
        <div className="text-gray-600 text-xs">AI x RWA Track</div>
      </div>

      <div className="space-y-2">
        {pools.map((pool, i) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-3 rounded-lg border ${
              pool.constitutionCompliant
                ? 'border-green-900 bg-green-950/20'
                : 'border-red-900 bg-red-950/20'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="text-white text-xs font-bold">{pool.asset}</span>
                <span className="text-gray-500 text-xs ml-2">{pool.type}</span>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-xs font-bold">{pool.apy}% APY</div>
                <div className="text-gray-500 text-xs">{formatTVL(pool.tvl)} TVL</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">{pool.protocol}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                pool.constitutionCompliant
                  ? 'bg-green-950 text-green-400 border border-green-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {pool.constitutionCompliant ? '✓ COMPLIANT' : '✗ BLOCKED'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 text-gray-700 text-xs text-center">
        Constitution validates all RWA allocations before execution
      </div>
    </div>
  )
}
