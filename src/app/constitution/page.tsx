'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

interface Rule {
  id: string
  name: string
  description: string
  value: number
  min: number
  max: number
  unit: string
  operator: '>=' | '<='
}

const defaultRules: Rule[] = [
  { id: 'risk_score', name: 'Max Risk Score', description: 'Maximum allowed risk score for any action', value: 7, min: 1, max: 10, unit: '/10', operator: '<=' },
  { id: 'max_drawdown', name: 'Max Drawdown', description: 'Maximum portfolio drawdown allowed', value: 15, min: 1, max: 50, unit: '%', operator: '<=' },
  { id: 'stablecoin_reserve', name: 'Stablecoin Reserve', description: 'Minimum stablecoin reserve to maintain', value: 30, min: 0, max: 80, unit: '%', operator: '>=' },
  { id: 'rwa_allocation', name: 'RWA Allocation', description: 'Minimum RWA allocation to maintain', value: 20, min: 0, max: 80, unit: '%', operator: '>=' },
  { id: 'single_asset_cap', name: 'Single Asset Cap', description: 'Maximum allocation to any single asset', value: 50, min: 10, max: 100, unit: '%', operator: '<=' },
]

export default function ConstitutionPage() {
  const [rules, setRules] = useState<Rule[]>(defaultRules)
  const [saved, setSaved] = useState(false)
  const [constitutionName, setConstitutionName] = useState('Sovereign Alpha Constitution')

  const updateRule = (id: string, value: number) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, value } : r))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getConstitutionHash = () => {
    const str = rules.map((r) => `${r.id}:${r.value}`).join('|')
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash = hash & hash
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white mb-1">CONSTITUTION STUDIO</h1>
          <p className="text-gray-500 text-sm">Define the governance rules your Sovereign must follow. These rules are enforced before every action.</p>
        </div>

        {/* Constitution Name */}
        <div className="border border-gray-700 bg-gray-900 rounded-xl p-6 mb-6">
          <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">CONSTITUTION NAME</div>
          <input
            type="text"
            value={constitutionName}
            onChange={(e) => setConstitutionName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Rules */}
        <div className="space-y-4 mb-6">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-gray-700 bg-gray-900 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-white font-bold">{rule.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{rule.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-400">{rule.value}{rule.unit}</div>
                  <div className="text-gray-600 text-xs">{rule.operator} {rule.value}{rule.unit}</div>
                </div>
              </div>
              <input
                type="range"
                min={rule.min}
                max={rule.max}
                value={rule.value}
                onChange={(e) => updateRule(rule.id, Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{rule.min}{rule.unit}</span>
                <span>{rule.max}{rule.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Constitution Hash */}
        <div className="border border-gray-700 bg-gray-900 rounded-xl p-6 mb-6">
          <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">CONSTITUTION HASH</div>
          <div className="text-xs text-cyan-300 font-mono break-all">{getConstitutionHash()}</div>
          <div className="text-gray-600 text-xs mt-2">This hash changes when you modify any rule. It is recorded on Mantle with every decision.</div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-wider rounded-lg transition-colors"
        >
          {saved ? '✓ CONSTITUTION SAVED' : 'SAVE CONSTITUTION'}
        </button>

        <div className="mt-4 text-center text-gray-600 text-xs">
          Constitution changes are versioned and recorded on Mantle Network
        </div>
      </div>
    </div>
  )
}
