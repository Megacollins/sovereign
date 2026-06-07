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
  {
    icon: '🏛️',
    title: 'Real-World Asset Focus',
    description: 'Built for Mantle\'s RWA ecosystem. Governs allocations to USDY, mETH, fBTC with live Bybit market data powering risk scores.',
  },
  {
    icon: '🤖',
    title: 'AI-Native Identity',
    description: 'Every Sovereign receives a permanent ERC-8004 identity NFT on Mantle — establishing verifiable on-chain agent reputation.',
  },
]

const stats = [
  { value: '3', label: 'Mainnet Contracts' },
  { value: '5', label: 'Constitutional Rules' },
  { value: '100%', label: 'Decisions Auditable' },
  { value: 'ERC-8004', label: 'Identity Standard' },
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
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-16 text-center">
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
          <div className="flex gap-4 justify-center flex-wrap mb-6">
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
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <a
              href="https://explorer.mantle.xyz/address/0x91606bd2ae6dfe3a82cc60644e75c87e4656f2b5"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              Deployed on Mantle Mainnet · View Contracts →
            </a>
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Powered By */}
      <section className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-6">
            <div className="text-gray-600 text-xs tracking-widest">POWERED BY THE MANTLE ECOSYSTEM</div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { name: 'Mantle', role: 'L2 Infrastructure' },
              { name: 'Bybit', role: 'Market Data' },
              { name: 'Ondo Finance', role: 'USDY RWA' },
              { name: 'Mantle LSP', role: 'mETH Staking' },
              { name: 'ERC-8004', role: 'Agent Identity' },
              { name: 'Groq', role: 'AI Inference' },
            ].map((p) => (
              <div key={p.name} className="text-center">
                <div className="text-gray-300 text-sm font-bold">{p.name}</div>
                <div className="text-gray-600 text-xs">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-gray-800 bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-black tracking-widest text-gray-400 mb-2">BUILT WITH</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Mantle Network', desc: 'L2 Blockchain' },
              { name: 'ERC-8004', desc: 'Agent Identity' },
              { name: 'Bybit API', desc: 'Live Market Data' },
              { name: 'Groq LLaMA', desc: 'AI Decisions' },
              { name: 'Next.js', desc: 'Frontend' },
              { name: 'Solidity', desc: 'Smart Contracts' },
              { name: 'Viem', desc: 'Blockchain Client' },
              { name: 'Framer Motion', desc: 'Animations' },
            ].map((tech) => (
              <div key={tech.name} className="border border-gray-700 bg-gray-900 rounded-lg px-4 py-2 text-center">
                <div className="text-white text-xs font-bold">{tech.name}</div>
                <div className="text-gray-600 text-xs">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-black tracking-widest text-white mb-3">SOVEREIGN</div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                The first constitutional accountability framework for autonomous AI financial institutions.
                Every decision validated. Every proof on-chain. Every Sovereign accountable.
              </p>
              <div className="inline-flex items-center gap-2 border border-cyan-800 bg-cyan-950/30 text-cyan-400 text-xs px-4 py-2 rounded-full tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
                LIVE ON MANTLE MAINNET
              </div>
            </div>

            {/* Navigate */}
            <div>
              <div className="text-gray-400 text-xs font-bold tracking-widest mb-4">NAVIGATE</div>
              <ul className="space-y-3">
                {[
                  { label: 'Live Demo', href: '/demo' },
                  { label: 'Leaderboard', href: '/leaderboard' },
                  { label: 'Constitution', href: '/constitution' },
                  { label: 'Audit Terminal', href: '/audit' },
                  { label: 'Create Sovereign', href: '/create' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contracts */}
            <div>
              <div className="text-gray-400 text-xs font-bold tracking-widest mb-4">CONTRACTS</div>
              <ul className="space-y-3">
                {[
                  { label: 'SovereignIdentity', full: '0x91606bd2ae6dfe3a82cc60644e75c87e4656f2b5', short: '0x91606b...f2b5' },
                  { label: 'ProofRegistry', full: '0xf4d31a74fa4881083ccfcb0cbe2d89f98b07f5bd', short: '0xf4d31a...f5bd' },
                  { label: 'ReputationRegistry', full: '0xa2a19f470c62119ceb93ef716068b0ed81aebbd0', short: '0xa2a19f...bd0' },
                ].map((c) => (
                  <li key={c.label}>
                    <a
                      href={`https://explorer.mantle.xyz/address/${c.full}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
                    >
                      <div className="text-gray-300 text-xs font-bold mb-0.5">{c.label}</div>
                      <div className="font-mono text-xs">{c.short}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-xs tracking-wider">
              © 2026 SOVEREIGN · MANTLE TURING TEST HACKATHON · BUILT ON MANTLE NETWORK
            </div>
            <div className="flex items-center gap-6 text-xs">
              <a
                href="https://github.com/Megacollins/sovereign"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://dorahacks.io/hackathon/mantleturingtesthackathon2026/detail"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                DoraHacks
              </a>
              <a
                href="https://explorer.mantle.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                Mantle Explorer
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="border-t border-gray-900 bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-3 text-center">
            <span className="text-gray-700 text-xs tracking-widest font-bold">
              AN AI CANNOT ACT UNLESS IT PROVES IT IS ALLOWED TO ACT · EVERY DECISION. ON-CHAIN. WITH PROOF.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
