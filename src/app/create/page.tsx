'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Step = 1 | 2 | 3 | 4

const strategies = [
  { id: 'conservative', name: 'Conservative', description: 'Low risk, stable returns. Prioritizes capital preservation.', icon: '🛡️', rules: { risk: 5, drawdown: 10, stablecoin: 40, rwa: 30, cap: 30 } },
  { id: 'balanced', name: 'Balanced', description: 'Moderate risk and return. Mix of yield and stability.', icon: '⚖️', rules: { risk: 7, drawdown: 15, stablecoin: 30, rwa: 20, cap: 50 } },
  { id: 'aggressive', name: 'Aggressive', description: 'Higher risk tolerance. Optimizes for maximum yield.', icon: '⚡', rules: { risk: 8, drawdown: 25, stablecoin: 20, rwa: 15, cap: 60 } },
  { id: 'rwa', name: 'RWA Focus', description: 'Specializes in real-world assets on Mantle.', icon: '🏛️', rules: { risk: 4, drawdown: 8, stablecoin: 25, rwa: 50, cap: 40 } },
]

export default function CreateSovereignPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [sovereignId] = useState(Math.floor(Math.random() * 9000) + 1000)

  const selectedStrategyData = strategies.find((s) => s.id === selectedStrategy)

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 2500))
    setCreating(false)
    setCreated(true)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white mb-1">CREATE SOVEREIGN</h1>
          <p className="text-gray-500 text-sm">Deploy your autonomous AI financial institution on Mantle</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                step > s ? 'border-cyan-500 bg-cyan-500 text-black' :
                step === s ? 'border-cyan-500 text-cyan-400' :
                'border-gray-700 text-gray-600'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 4 && <div className={`h-px w-12 ${step > s ? 'bg-cyan-500' : 'bg-gray-700'}`} />}
            </div>
          ))}
          <div className="ml-4 text-xs text-gray-500">
            {step === 1 && 'Name your Sovereign'}
            {step === 2 && 'Choose strategy'}
            {step === 3 && 'Review constitution'}
            {step === 4 && 'Deploy'}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 — Name */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="border border-gray-700 bg-gray-900 rounded-xl p-6 mb-6">
                <div className="text-gray-400 text-xs font-bold mb-4 tracking-widest">SOVEREIGN NAME</div>
                <input
                  type="text"
                  placeholder="e.g. Sovereign Alpha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors mb-2"
                  maxLength={32}
                />
                <div className="text-gray-600 text-xs">This name becomes your Sovereign's permanent on-chain identity via ERC-8004.</div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black tracking-wider rounded-lg transition-colors"
              >
                CONTINUE →
              </button>
            </motion.div>
          )}

          {/* Step 2 — Strategy */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-gray-400 text-xs font-bold mb-4 tracking-widest">SELECT STRATEGY</div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {strategies.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStrategy(s.id)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      selectedStrategy === s.id
                        ? 'border-cyan-500 bg-cyan-950/30'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-white font-bold text-sm mb-1">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:border-gray-400 transition-colors text-sm">← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedStrategy}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black tracking-wider rounded-lg transition-colors"
                >
                  CONTINUE →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && selectedStrategyData && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="border border-gray-700 bg-gray-900 rounded-xl p-6 mb-4">
                <div className="text-gray-400 text-xs font-bold mb-4 tracking-widest">SOVEREIGN SUMMARY</div>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="text-white font-bold">{name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Strategy</span><span className="text-white">{selectedStrategyData.name} {selectedStrategyData.icon}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Network</span><span className="text-cyan-400">Mantle Mainnet</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Identity Standard</span><span className="text-white">ERC-8004</span></div>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">CONSTITUTIONAL RULES</div>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Max Risk Score', `≤ ${selectedStrategyData.rules.risk}/10`],
                      ['Max Drawdown', `≤ ${selectedStrategyData.rules.drawdown}%`],
                      ['Stablecoin Reserve', `≥ ${selectedStrategyData.rules.stablecoin}%`],
                      ['RWA Allocation', `≥ ${selectedStrategyData.rules.rwa}%`],
                      ['Single Asset Cap', `≤ ${selectedStrategyData.rules.cap}%`],
                    ].map(([rule, value]) => (
                      <div key={rule} className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">{rule}</span>
                        <span className="text-cyan-300 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:border-gray-400 transition-colors text-sm">← Back</button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-wider rounded-lg transition-colors"
                >
                  DEPLOY SOVEREIGN →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4 — Deploy */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {!created ? (
                <div className="border border-gray-700 bg-gray-900 rounded-xl p-8 text-center">
                  {!creating ? (
                    <>
                      <div className="text-4xl mb-4">🏛️</div>
                      <div className="text-white font-black text-xl mb-2">{name}</div>
                      <div className="text-gray-500 text-sm mb-6">Ready to deploy on Mantle Network</div>
                      <button
                        onClick={handleCreate}
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-wider rounded-lg transition-colors"
                      >
                        DEPLOY ON MANTLE →
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <motion.div className="text-4xl" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>⚙️</motion.div>
                      <div className="text-white font-bold">Deploying {name}...</div>
                      {['Creating ERC-8004 identity...', 'Recording constitution hash...', 'Initializing reputation...', 'Confirming on Mantle...'].map((msg, i) => (
                        <motion.div key={msg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }}
                          className="text-gray-400 text-sm">{msg}</motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-green-700 bg-green-950/20 rounded-xl p-8 text-center"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <div className="text-green-400 font-black text-2xl mb-2">SOVEREIGN DEPLOYED</div>
                  <div className="text-white text-lg mb-6">{name}</div>
                  <div className="border border-gray-700 bg-gray-900 rounded-lg p-4 text-left space-y-2 text-sm mb-6">
                    <div className="flex justify-between"><span className="text-gray-400">Sovereign ID</span><span className="text-cyan-400 font-bold">#{sovereignId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Network</span><span className="text-white">Mantle Mainnet</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Identity</span><span className="text-white">ERC-8004</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Initial Trust Score</span><span className="text-cyan-400 font-bold">75</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400 font-bold">ACTIVE</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => router.push('/demo')} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-lg transition-colors text-sm">
                      WATCH IT OPERATE →
                    </button>
                    <button onClick={() => router.push('/leaderboard')} className="flex-1 py-3 border border-gray-600 text-gray-300 hover:border-gray-400 rounded-lg transition-colors text-sm">
                      VIEW LEADERBOARD
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
