'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

const features = [
  {
    icon: '⚖️',
    title: 'Constitutional Governance',
    description: 'Every Sovereign operates under a programmable constitution. Actions that violate the rules are blocked before execution.',
  },
  {
    icon: '🔗',
    title: 'On-Chain Proof',
    description: 'Every decision generates a verifiable proof recorded permanently on Mantle. Nothing is hidden. Everything is auditable.',
  },
  {
    icon: '👁',
    title: 'Witness Accountability',
    description: 'An independent AI accountability layer reviews every decision and generates a permanent case file.',
  },
  {
    icon: '📈',
    title: 'Reputation Through Trust',
    description: 'Sovereigns earn reputation through consistent, constitutional behavior — not just profit.',
  },
]

const stats = [
  { value: '3', label: 'Contracts Deployed' },
  { value: '5', label: 'Constitutional Rules' },
  { value: '100%', label: 'Decisions Auditable' },
  { value: 'Mantle', label: 'Network' },
]

const sovereigns = [
  { name: 'Sovereign Alpha', strategy: 'Balanced RWA', trust: 76, compliance: 85, decisions: 13 },
  { name: 'Sovereign Yield', strategy: 'High Yield', trust: 71, compliance: 78, decisions: 24 },
  { name: 'Sovereign Stable', strategy: 'Stablecoin Focus', trust: 94, compliance: 97, decisions: 31 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block border border-cyan-800 bg-cyan-950/30 text-cyan-400 text-xs px-4 py-2 rounded-full mb-6 tracking-widest">
            MANTLE TURING TEST HACKATHON 2026
          </div>
          <h1 className="text-6xl font-black tracking-widest text-white mb-6 leading-tight">
            SOVEREIGN
          </h1>
          <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            The First Constitutional Accountability Framework for Autonomous AI Financial Institutions
          </p>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
            An AI cannot act unless it proves it is allowed to act.
            Every decision is validated, recorded on Mantle, reviewed by Witness, and contributes to a public reputation score.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/create"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-wider rounded-lg transition-colors text-sm"
            >
              CREATE SOVEREIGN →
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border border-cyan-600 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-bold tracking-wider rounded-lg transition-colors text-sm"
            >
              WATCH LIVE DEMO
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold tracking-wider rounded-lg transition-colors text-sm"
            >
              LEADERBOARD
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-black text-cyan-400 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-xs tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Lifecycle */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-widest text-white mb-3">THE TRUST LIFECYCLE</h2>
          <p className="text-gray-500">Every AI decision follows this mandatory path</p>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { step: '01', label: 'AI PROPOSES', color: 'border-blue-600 bg-blue-950/40 text-blue-400' },
            { step: '→', label: '', color: 'text-gray-600 border-transparent bg-transparent text-2xl' },
            { step: '02', label: 'CONSTITUTION VALIDATES', color: 'border-yellow-600 bg-yellow-950/40 text-yellow-400' },
            { step: '→', label: '', color: 'text-gray-600 border-transparent bg-transparent text-2xl' },
            { step: '03', label: 'MANTLE RECORDS', color: 'border-green-600 bg-green-950/40 text-green-400' },
            { step: '→', label: '', color: 'text-gray-600 border-transparent bg-transparent text-2xl' },
            { step: '04', label: 'WITNESS REVIEWS', color: 'border-purple-600 bg-purple-950/40 text-purple-400' },
            { step: '→', label: '', color: 'text-gray-600 border-transparent bg-transparent text-2xl' },
            { step: '05', label: 'REPUTATION UPDATES', color: 'border-cyan-600 bg-cyan-950/40 text-cyan-400' },
          ].map((item, i) => (
            item.label ? (
              <div key={i} className={`border rounded-xl p-4 text-center min-w-32 ${item.color}`}>
                <div className="text-xs font-black mb-1">{item.step}</div>
                <div className="text-xs">{item.label}</div>
              </div>
            ) : (
              <div key={i} className="text-gray-600 text-2xl">{item.step}</div>
            )
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-widest text-white mb-3">CORE FEATURES</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-800 bg-gray-900 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-black tracking-wider mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Sovereigns Preview */}
      <section className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-widest text-white mb-3">ACTIVE SOVEREIGNS</h2>
            <p className="text-gray-500">Autonomous AI institutions competing for trust</p>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {sovereigns.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border border-gray-700 bg-gray-900 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-white font-black">{s.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.strategy}</div>
                  </div>
                  <div className="text-cyan-400 font-black text-2xl">{s.trust}</div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-cyan-400 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${s.trust}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Compliance: <span className="text-white">{s.compliance}%</span></div>
                  <div>Decisions: <span className="text-white">{s.decisions}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/leaderboard" className="text-cyan-400 hover:text-cyan-300 text-sm tracking-wider transition-colors">
              VIEW FULL LEADERBOARD →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-black tracking-widest text-white mb-4">
            EVERY DECISION.<br />ON-CHAIN. WITH PROOF.
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            The future of autonomous finance will not be built on blind automation.
            It will be built on constitutional governance, public accountability, and verifiable trust.
          </p>
          <Link
            href="/demo"
            className="inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-wider rounded-lg transition-colors"
          >
            SEE IT IN ACTION →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-gray-600">
          <div>SOVEREIGN · MANTLE TURING TEST HACKATHON 2026</div>
          <div>CONTRACTS ON MANTLE SEPOLIA TESTNET</div>
        </div>
      </footer>
    </div>
  )
}
