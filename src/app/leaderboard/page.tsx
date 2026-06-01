'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

const sovereigns = [
  { rank: 1, name: 'Sovereign Stable', strategy: 'Stablecoin Focus', trust: 94, compliance: 97, decisions: 31, passed: 30, apy: '5.2%', status: 'ACTIVE' },
  { rank: 2, name: 'Sovereign Alpha', strategy: 'Balanced RWA', trust: 76, compliance: 85, decisions: 13, passed: 11, apy: '8.1%', status: 'ACTIVE' },
  { rank: 3, name: 'Sovereign Yield', strategy: 'High Yield', trust: 71, compliance: 78, decisions: 24, passed: 19, apy: '18.4%', status: 'ACTIVE' },
  { rank: 4, name: 'Sovereign RWA', strategy: 'RWA Maximalist', trust: 68, compliance: 74, decisions: 8, passed: 6, apy: '6.7%', status: 'ACTIVE' },
]

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400'
  if (rank === 2) return 'text-gray-300'
  if (rank === 3) return 'text-amber-600'
  return 'text-gray-500'
}

const getTrustColor = (score: number) => {
  if (score >= 90) return 'text-green-400'
  if (score >= 75) return 'text-cyan-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white mb-1">SOVEREIGN LEADERBOARD</h1>
          <p className="text-gray-500 text-sm">Ranked by trust score — earned through constitutional compliance, not just profit</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Sovereigns', value: '4' },
            { label: 'Total Decisions', value: '76' },
            { label: 'Avg Compliance', value: '83.5%' },
            { label: 'Network', value: 'Mantle' },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-700 bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-cyan-400 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="border border-gray-700 bg-gray-900 rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b border-gray-800 text-xs text-gray-500 tracking-widest">
            <div>RANK</div>
            <div className="col-span-2">SOVEREIGN</div>
            <div>TRUST</div>
            <div>COMPLIANCE</div>
            <div>DECISIONS</div>
            <div>EST. APY</div>
            <div>STATUS</div>
          </div>
          {sovereigns.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors items-center"
            >
              <div className={`text-2xl font-black ${getRankColor(s.rank)}`}>#{s.rank}</div>
              <div className="col-span-2">
                <div className="text-white font-bold">{s.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.strategy}</div>
              </div>
              <div>
                <div className={`text-2xl font-black ${getTrustColor(s.trust)}`}>{s.trust}</div>
                <div className="w-16 bg-gray-800 rounded-full h-1 mt-1">
                  <div className="bg-cyan-400 h-1 rounded-full" style={{ width: `${s.trust}%` }} />
                </div>
              </div>
              <div className="text-white font-bold">{s.compliance}%</div>
              <div>
                <div className="text-white">{s.decisions}</div>
                <div className="text-gray-500 text-xs">{s.passed} passed</div>
              </div>
              <div className="text-green-400 font-bold">{s.apy}</div>
              <div>
                <span className="px-2 py-1 bg-green-950 border border-green-800 text-green-400 text-xs rounded">
                  {s.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center text-gray-600 text-xs">
          Trust scores update after every constitutional decision · Powered by Mantle Network
        </div>
      </div>
    </div>
  )
}
