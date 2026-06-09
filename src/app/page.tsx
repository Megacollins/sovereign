'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'

const CONTRACTS = {
  identity: process.env.NEXT_PUBLIC_SOVEREIGN_IDENTITY_ADDRESS || '0x91606bd2ae6dfe3a82cc60644e75c87e4656f2b5',
  proof: process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || '0xf4d31a74fa4881083ccfcb0cbe2d89f98b07f5bd',
  reputation: process.env.NEXT_PUBLIC_REPUTATION_REGISTRY_ADDRESS || '0xa2a19f470c62119ceb93ef716068b0ed81aebbd0',
}
const EXPLORER = 'https://explorer.mantle.xyz'

// ─── Live hero pipeline simulation ───────────────────────────────────────────
type Phase = 'PROPOSE' | 'VALIDATE' | 'REJECTED' | 'APPROVED' | 'PROOF' | 'TRUST'

const HERO_SCENARIOS = [
  { action: 'Allocate 80% to High-Yield Asset X', risk: 9, limit: 7, rejected: true },
  { action: 'Allocate 10% to USDY RWA Pool', risk: 3, limit: 7, rejected: false },
  { action: 'Stake 15% in mETH Liquid Staking', risk: 4, limit: 7, rejected: false },
  { action: 'Allocate 60% to single RWA token', risk: 8, limit: 7, rejected: true },
]

function HeroPipeline() {
  const [phase, setPhase] = useState<Phase>('PROPOSE')
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [trust, setTrust] = useState(82)
  const scenario = HERO_SCENARIOS[scenarioIdx]

  useEffect(() => {
    const seq: { phase: Phase; delay: number }[] = scenario.rejected
      ? [
          { phase: 'PROPOSE', delay: 0 },
          { phase: 'VALIDATE', delay: 1400 },
          { phase: 'REJECTED', delay: 2600 },
        ]
      : [
          { phase: 'PROPOSE', delay: 0 },
          { phase: 'VALIDATE', delay: 1400 },
          { phase: 'APPROVED', delay: 2600 },
          { phase: 'PROOF', delay: 3800 },
          { phase: 'TRUST', delay: 5200 },
        ]

    const timers = seq.map(({ phase, delay }) => setTimeout(() => setPhase(phase), delay))
    const cycle = setTimeout(() => {
      if (!scenario.rejected) setTrust((t) => Math.min(100, t + 1))
      setScenarioIdx((i) => (i + 1) % HERO_SCENARIOS.length)
    }, scenario.rejected ? 4400 : 6800)

    return () => { timers.forEach(clearTimeout); clearTimeout(cycle) }
  }, [scenarioIdx, scenario.rejected])

  const steps: { id: Phase; label: string }[] = [
    { id: 'PROPOSE', label: 'AI PROPOSAL' },
    { id: 'VALIDATE', label: 'VALIDATION' },
    { id: scenario.rejected ? 'REJECTED' : 'APPROVED', label: scenario.rejected ? 'REJECTED' : 'APPROVED' },
    { id: 'PROOF', label: 'PROOF' },
    { id: 'TRUST', label: 'TRUST SCORE' },
  ]

  const phaseOrder: Phase[] = ['PROPOSE', 'VALIDATE', scenario.rejected ? 'REJECTED' : 'APPROVED', 'PROOF', 'TRUST']
  const currentIdx = phaseOrder.indexOf(phase)

  return (
    <div className="border border-[#1C2333] bg-[#0F1422]">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1C2333]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2]" />
          <span className="text-[#8AA0FF] text-[11px] tracking-widest font-mono">SOVEREIGN-ALPHA · LIVE</span>
        </div>
        <span className="text-[#5A6680] text-[11px] font-mono">MANTLE MAINNET</span>
      </div>

      {/* Pipeline rail */}
      <div className="flex items-stretch border-b border-[#1C2333]">
        {steps.map((step, i) => {
          const active = i === currentIdx
          const done = i < currentIdx
          const isRej = step.id === 'REJECTED'
          const color = isRej ? '#FF4D4D' : step.id === 'APPROVED' ? '#00FFB2' : step.id === 'PROOF' ? '#FFD166' : step.id === 'TRUST' ? '#8AA0FF' : '#8AA0FF'
          return (
            <div key={i} className="flex-1 px-3 py-3 border-r border-[#1C2333] last:border-r-0 relative">
              <div className="text-[10px] font-mono tracking-wider mb-1" style={{ color: active || done ? color : '#5A6680' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono tracking-wider" style={{ color: active ? color : done ? '#8AA0FF' : '#5A6680' }}>
                {step.label}
              </div>
              {active && (
                <motion.div
                  layoutId="hero-rail"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: color }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Live readout */}
      <div className="p-5 font-mono min-h-[180px]">
        <AnimatePresence mode="wait">
          {(phase === 'PROPOSE' || phase === 'VALIDATE') && (
            <motion.div key="proposing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                <span className="text-[#5A6680]">AI ACTION</span>
                <span className="text-[#E6EAF2] text-right">{scenario.action}</span>
                <span className="text-[#5A6680]">RISK SCORE</span>
                <span className="text-right" style={{ color: scenario.risk > scenario.limit ? '#FF4D4D' : '#00FFB2' }}>{scenario.risk}.0</span>
                <span className="text-[#5A6680]">POLICY LIMIT</span>
                <span className="text-[#E6EAF2] text-right">{scenario.limit}.0</span>
                <span className="text-[#5A6680]">STATUS</span>
                <span className="text-right text-[#8AA0FF]">
                  {phase === 'PROPOSE' ? 'PROPOSED' : 'VALIDATING…'}
                </span>
              </div>
            </motion.div>
          )}

          {phase === 'REJECTED' && (
            <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-[#FF4D4D] text-2xl tracking-widest mb-2">BLOCKED</div>
              <div className="text-[#5A6680] text-[13px] mb-4">Risk threshold exceeded · {scenario.risk}.0 &gt; {scenario.limit}.0</div>
              <div className="text-[#5A6680] text-[11px]">Action prevented before execution · Recorded on Mantle</div>
            </motion.div>
          )}

          {phase === 'APPROVED' && (
            <motion.div key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-[#00FFB2] text-2xl tracking-widest mb-2">APPROVED</div>
              <div className="text-[#5A6680] text-[13px]">All constitutional constraints satisfied</div>
            </motion.div>
          )}

          {phase === 'PROOF' && (
            <motion.div key="proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-[#FFD166] text-sm tracking-widest mb-3">PROOF RECORDED ON MANTLE</div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-[#5A6680]">DECISION HASH</span><span className="text-[#FFD166]">0x4f3a…b6c7</span></div>
                <div className="flex justify-between"><span className="text-[#5A6680]">CONSTITUTION</span><span className="text-[#FFD166]">0x9b2c…d8e9</span></div>
                <div className="flex justify-between"><span className="text-[#5A6680]">TX STATUS</span><span className="text-[#00FFB2]">CONFIRMED</span></div>
              </div>
            </motion.div>
          )}

          {phase === 'TRUST' && (
            <motion.div key="trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-[#8AA0FF] text-sm tracking-widest mb-3">TRUST SCORE UPDATED</div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-[#E6EAF2] text-4xl tracking-tight">{trust}</span>
                <span className="text-[#00FFB2] text-sm mb-1">▲ +1</span>
              </div>
              <div className="h-1 bg-[#1C2333] w-full">
                <motion.div className="h-1 bg-[#8AA0FF]" initial={{ width: 0 }} animate={{ width: `${trust}%` }} transition={{ duration: 0.8 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E6EAF2]">
      <Navbar />

      {/* ── SECTION 1 — HERO ── */}
      <section className="border-b border-[#1C2333] grid-bg">
        <div className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#1C2333] px-3 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2]" />
              <span className="text-[#8AA0FF] text-[11px] tracking-widest font-mono">CONSTITUTIONAL ENFORCEMENT LAYER</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Every Decision.<br />On-Chain.<br />With Proof.
            </h1>
            <p className="text-[#8AA0FF] text-lg leading-relaxed mb-10 max-w-xl">
              Sovereign is a constitutional enforcement layer for AI agents. Every action is validated against rules, recorded on Mantle, and auditable through Witness.
            </p>
            <div className="flex gap-3">
              <Link href="/demo" className="px-6 py-3 bg-[#E6EAF2] text-[#0B0F1A] text-sm font-semibold tracking-wide hover:bg-white transition-colors">
                Launch Demo
              </Link>
              <a href={`${EXPLORER}/address/${CONTRACTS.identity}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-[#1C2333] text-[#E6EAF2] text-sm font-semibold tracking-wide hover:border-[#5A6680] transition-colors">
                View Contracts
              </a>
            </div>
          </div>
          <HeroPipeline />
        </div>
      </section>

      {/* ── SECTION 2 — HOW IT WORKS ── */}
      <section className="border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-3">SYSTEM ARCHITECTURE</div>
          <h2 className="text-3xl font-bold tracking-tight mb-12">How It Works</h2>
          <div className="grid lg:grid-cols-4 gap-px bg-[#1C2333] border border-[#1C2333]">
            {[
              { n: '01', t: 'AI Proposes Action', d: 'An autonomous agent submits a financial action for execution.', c: '#8AA0FF' },
              { n: '02', t: 'Sovereign Validates', d: 'The action is checked against every constitutional rule before it can proceed.', c: '#FFD166' },
              { n: '03', t: 'Witness Records Proof', d: 'A verifiable proof is committed on Mantle and reviewed by the accountability layer.', c: '#00FFB2' },
              { n: '04', t: 'Reputation Updates', d: 'Trust score adjusts based on compliance — never on profit alone.', c: '#8AA0FF' },
            ].map((s) => (
              <div key={s.n} className="bg-[#0B0F1A] p-6">
                <div className="text-2xl font-mono mb-4" style={{ color: s.c }}>{s.n}</div>
                <div className="text-[#E6EAF2] font-semibold mb-2">{s.t}</div>
                <div className="text-[#5A6680] text-sm leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — LIVE DECISION ENGINE ── */}
      <section className="border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-3">DECISION ENGINE</div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Risk is enforced<br />before execution.</h2>
            <p className="text-[#8AA0FF] leading-relaxed mb-6 max-w-md">
              The Constitution Engine evaluates every proposed action against hard policy limits. Violations are not warnings — they are hard blocks.
            </p>
            <Link href="/demo" className="text-[#E6EAF2] text-sm font-semibold border-b border-[#1C2333] hover:border-[#E6EAF2] transition-colors pb-1">
              Run the live engine →
            </Link>
          </div>
          <div className="border border-[#1C2333] bg-[#0F1422] p-6 font-mono">
            <div className="text-[#5A6680] text-[11px] tracking-widest mb-4">DECISION #1042</div>
            <div className="grid grid-cols-2 gap-y-3 text-[13px] mb-5">
              <span className="text-[#5A6680]">AI ACTION</span>
              <span className="text-[#E6EAF2] text-right">Allocate 15% to Asset Pool</span>
              <span className="text-[#5A6680]">RISK SCORE</span>
              <span className="text-[#FF4D4D] text-right">8.2</span>
              <span className="text-[#5A6680]">POLICY LIMIT</span>
              <span className="text-[#E6EAF2] text-right">7.0</span>
            </div>
            <div className="border-t border-[#1C2333] pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5A6680] text-[13px]">RESULT</span>
                <span className="text-[#FF4D4D] text-lg tracking-widest">BLOCKED</span>
              </div>
              <div className="text-[#5A6680] text-[12px]">Reason: Risk threshold exceeded</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — WITNESS NETWORK ── */}
      <section className="border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-3">ACCOUNTABILITY LAYER</div>
          <h2 className="text-3xl font-bold tracking-tight mb-12">Witness Network</h2>
          <div className="border border-[#1C2333] bg-[#0F1422] font-mono">
            <div className="grid grid-cols-12 px-5 py-3 border-b border-[#1C2333] text-[#5A6680] text-[11px] tracking-widest">
              <span className="col-span-2">CASE</span>
              <span className="col-span-5">ACTION</span>
              <span className="col-span-2">RISK</span>
              <span className="col-span-3 text-right">VERDICT</span>
            </div>
            {[
              { id: '1042', action: 'Allocate 15% to Asset Pool', risk: '8.2', verdict: 'REJECTED' },
              { id: '1041', action: 'Allocate 10% to USDY RWA Pool', risk: '3.0', verdict: 'APPROVED' },
              { id: '1040', action: 'Stake 15% in mETH Liquid Staking', risk: '4.0', verdict: 'APPROVED' },
              { id: '1039', action: 'Allocate 60% to single RWA token', risk: '8.0', verdict: 'REJECTED' },
              { id: '1038', action: 'Allocate 8% to fBTC Yield', risk: '4.0', verdict: 'APPROVED' },
            ].map((c) => (
              <div key={c.id} className="grid grid-cols-12 px-5 py-3.5 border-b border-[#1C2333] last:border-b-0 text-[13px] items-center hover:bg-[#0B0F1A] transition-colors">
                <span className="col-span-2 text-[#8AA0FF]">#{c.id}</span>
                <span className="col-span-5 text-[#E6EAF2]">{c.action}</span>
                <span className="col-span-2" style={{ color: parseFloat(c.risk) > 7 ? '#FF4D4D' : '#00FFB2' }}>{c.risk}</span>
                <span className="col-span-3 text-right tracking-widest" style={{ color: c.verdict === 'APPROVED' ? '#00FFB2' : '#FF4D4D' }}>{c.verdict}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — TRUST SCORE ── */}
      <section className="border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="border border-[#1C2333] bg-[#0F1422] p-8">
            <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-4">SOVEREIGN-ALPHA · TRUST SCORE</div>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-6xl font-bold tracking-tight">94</span>
              <span className="text-[#00FFB2] text-sm mb-2 font-mono">▲ EARNED</span>
            </div>
            <div className="h-1 bg-[#1C2333] mb-6"><div className="h-1 bg-[#8AA0FF]" style={{ width: '94%' }} /></div>
            <div className="grid grid-cols-3 gap-px bg-[#1C2333] border border-[#1C2333] font-mono">
              {[['97%', 'COMPLIANCE'], ['31', 'AUDITS'], ['30', 'PASSED']].map(([v, l]) => (
                <div key={l} className="bg-[#0B0F1A] p-4 text-center">
                  <div className="text-[#E6EAF2] text-xl">{v}</div>
                  <div className="text-[#5A6680] text-[10px] tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-3">REPUTATION</div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Trust is earned,<br />not assumed.</h2>
            <p className="text-[#8AA0FF] leading-relaxed mb-6 max-w-md">
              A Sovereign&apos;s reputation is a function of its behavior over time — not its returns. Profit alone does not build trust.
            </p>
            <div className="space-y-3 font-mono text-sm">
              {['Constitutional compliance', 'Successful audits', 'Consistent behavior'].map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="text-[#00FFB2]">+</span>
                  <span className="text-[#E6EAF2]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — PROOF REGISTRY ── */}
      <section className="border-b border-[#1C2333]">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-[#5A6680] text-[11px] tracking-widest font-mono mb-3">VERIFICATION</div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">Proof Registry</h2>
          <p className="text-[#8AA0FF] mb-12 max-w-xl">Every decision proof is committed to live contracts on Mantle mainnet. Verify directly on-chain.</p>
          <div className="grid lg:grid-cols-3 gap-px bg-[#1C2333] border border-[#1C2333] font-mono">
            {[
              ['SovereignIdentity', 'ERC-8004', CONTRACTS.identity],
              ['ProofRegistry', 'Decision Proofs', CONTRACTS.proof],
              ['ReputationRegistry', 'Trust Scores', CONTRACTS.reputation],
            ].map(([name, role, addr]) => (
              <a key={name} href={`${EXPLORER}/address/${addr}`} target="_blank" rel="noopener noreferrer" className="bg-[#0B0F1A] p-6 hover:bg-[#0F1422] transition-colors group">
                <div className="text-[#E6EAF2] text-sm font-semibold mb-1">{name}</div>
                <div className="text-[#5A6680] text-[11px] tracking-widest mb-4">{role}</div>
                <div className="text-[#8AA0FF] text-[12px] break-all group-hover:text-[#FFD166] transition-colors">{addr}</div>
                <div className="text-[#5A6680] text-[11px] mt-3 tracking-widest">VIEW ON MANTLE →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — FOOTER ── */}
      <footer>
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-wrap justify-between items-center gap-6">
          <div className="font-mono text-[#5A6680] text-[11px] tracking-widest">
            SOVEREIGN · CONSTITUTIONAL ENFORCEMENT FOR AI AGENTS
          </div>
          <div className="flex gap-8 font-mono text-[12px] text-[#8AA0FF]">
            <Link href="/demo" className="hover:text-[#E6EAF2] transition-colors">Demo</Link>
            <a href="https://github.com/Megacollins/sovereign" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6EAF2] transition-colors">GitHub</a>
            <a href="https://mantle.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6EAF2] transition-colors">Mantle</a>
            <a href={`${EXPLORER}/address/${CONTRACTS.identity}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#E6EAF2] transition-colors">Registry</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
