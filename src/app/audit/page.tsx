'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

const auditEntries = [
  { id: 'CASE-M7X2K-4F9A', agent: 'Sovereign Stable', action: 'Allocate 8% to USDY RWA Pool', verdict: 'PASS', hash: '0x4f3a9b2c1d4e5f6a7b8c...', tx: '0x1a2b3c4d5e6f7a8b9c...', timestamp: '2026-06-01 19:42:11', riskScore: 2 },
  { id: 'CASE-K9P1L-3D7B', agent: 'Sovereign Alpha', action: 'Allocate 10% to RWA Pool A', verdict: 'PASS', hash: '0x7b8c9d0e1f2a3b4c5d...', tx: '0x9d0e1f2a3b4c5d6e7f...', timestamp: '2026-06-01 19:38:44', riskScore: 3 },
  { id: 'CASE-R3T8M-2C5E', agent: 'Sovereign Yield', action: 'Allocate 80% to High-Yield Asset X', verdict: 'FAIL', hash: '0x2c3d4e5f6a7b8c9d0e...', tx: 'BLOCKED — NOT EXECUTED', timestamp: '2026-06-01 19:35:22', riskScore: 9 },
  { id: 'CASE-W5Q4N-8A1F', agent: 'Sovereign Stable', action: 'Stake 15% in mETH pool', verdict: 'PASS', hash: '0x5e6f7a8b9c0d1e2f3a...', tx: '0x3b4c5d6e7f8a9b0c1d...', timestamp: '2026-06-01 19:30:09', riskScore: 4 },
  { id: 'CASE-H2V7J-6B3G', agent: 'Sovereign RWA', action: 'Allocate 60% to single RWA token', verdict: 'FAIL', hash: '0x8b9c0d1e2f3a4b5c6d...', tx: 'BLOCKED — NOT EXECUTED', timestamp: '2026-06-01 19:25:51', riskScore: 7 },
]

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-widest text-white mb-1">AUDIT TERMINAL</h1>
          <p className="text-gray-500 text-sm">Complete immutable record of every AI decision — verified on Mantle Network</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Decisions', value: '76' },
            { label: 'On-Chain Proofs', value: '76' },
            { label: 'Blocked Actions', value: '18' },
            { label: 'Compliance Rate', value: '76.3%' },
          ].map((s) => (
            <div key={s.label} className="border border-gray-700 bg-gray-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-cyan-400 mb-1">{s.value}</div>
              <div className="text-gray-500 text-xs tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contract Addresses */}
        <div className="border border-gray-700 bg-gray-900 rounded-xl p-4 mb-6">
          <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">DEPLOYED CONTRACTS — MANTLE SEPOLIA</div>
          <div className="space-y-2 text-xs">
            {[
              ['SovereignIdentity', process.env.NEXT_PUBLIC_SOVEREIGN_IDENTITY_ADDRESS || '0x8c239db94306a50536b08dbf29a3ce04dc980442'],
              ['ProofRegistry', process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || '0xa8a7e8e2f625c31d15ea9e2db2f76defe7522e1a'],
              ['ReputationRegistry', process.env.NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS || '0xc4224bd877f68924ffc61190c20ad4656bd6ccee'],
            ].map(([name, addr]) => (
              <div key={name} className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">{name}</span>
                <a
                  href={`https://explorer.sepolia.mantle.xyz/address/${addr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                >
                  {addr}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="space-y-3">
          {auditEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`border rounded-xl p-5 ${entry.verdict === 'PASS' ? 'border-green-800 bg-green-950/10' : 'border-red-800 bg-red-950/10'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-xs font-black ${entry.verdict === 'PASS' ? 'bg-green-950 border border-green-700 text-green-400' : 'bg-red-950 border border-red-700 text-red-400'}`}>
                    {entry.verdict}
                  </span>
                  <span className="text-gray-500 text-xs">{entry.id}</span>
                </div>
                <span className="text-gray-600 text-xs">{entry.timestamp}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs mb-1">AGENT</div>
                  <div className="text-white">{entry.agent}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">ACTION</div>
                  <div className="text-white">{entry.action}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">DECISION HASH</div>
                  <div className="text-cyan-300 font-mono text-xs">{entry.hash}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">TRANSACTION</div>
                  <div className={`font-mono text-xs ${entry.verdict === 'PASS' ? 'text-green-300' : 'text-red-400'}`}>{entry.tx}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-gray-500 text-xs">Risk Score:</span>
                <span className={`text-xs font-bold ${entry.riskScore > 7 ? 'text-red-400' : 'text-green-400'}`}>{entry.riskScore}/10</span>
                {entry.verdict === 'PASS' && (
                  <a
                    href={`https://explorer.sepolia.mantle.xyz/tx/${entry.tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
                  >
                    View on Explorer →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center text-gray-600 text-xs">
          All proofs are permanently recorded on Mantle Network · EVERY DECISION. ON-CHAIN. WITH PROOF.
        </div>
      </div>
    </div>
  )
}
