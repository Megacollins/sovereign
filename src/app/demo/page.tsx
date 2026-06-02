'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { validateAction, DEMO_ACTIONS, ProposedAction, ValidationResult } from '@/lib/constitutionEngine'
import { generateCaseFile, WitnessCaseFile } from '@/lib/witness'
import { createInitialReputation, updateReputation, SovereignReputation } from '@/lib/reputationEngine'
import { recordDecisionOnChain } from '@/lib/contracts'
import Navbar from '@/components/Navbar'
import MarketTicker from '@/components/MarketTicker'
import RWAPools from '@/components/RWAPools'

type FlowState = 'IDLE' | 'THINKING' | 'EVALUATING' | 'REJECTED' | 'APPROVED' | 'RECORDING' | 'RECORDED' | 'WITNESS' | 'REPUTATION'

const STATE_COLORS: Record<FlowState, string> = {
  IDLE: 'border-gray-700 bg-gray-900',
  THINKING: 'border-blue-500 bg-blue-950',
  EVALUATING: 'border-blue-400 bg-blue-950',
  REJECTED: 'border-red-500 bg-red-950',
  APPROVED: 'border-green-500 bg-green-950',
  RECORDING: 'border-yellow-400 bg-yellow-950',
  RECORDED: 'border-yellow-400 bg-yellow-950',
  WITNESS: 'border-purple-500 bg-purple-950',
  REPUTATION: 'border-cyan-500 bg-cyan-950',
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function DemoPage() {
  const [flowState, setFlowState] = useState<FlowState>('IDLE')
  const [currentAction, setCurrentAction] = useState<ProposedAction | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [evaluatingIndex, setEvaluatingIndex] = useState(-1)
  const [caseFile, setCaseFile] = useState<WitnessCaseFile | null>(null)
  const [reputation, setReputation] = useState<SovereignReputation>(createInitialReputation('SOVEREIGN-ALPHA', 'Sovereign Alpha'))
  const [prevTrustScore, setPrevTrustScore] = useState(75)
  const [txHash, setTxHash] = useState('0x7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0')
  const [auditLog, setAuditLog] = useState<WitnessCaseFile[]>([])
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [onChainStatus, setOnChainStatus] = useState<'idle' | 'sending' | 'confirmed' | 'simulated'>('idle')

  const runDemo = async (actionIndex: number) => {
    await runDemoWithAction(DEMO_ACTIONS[actionIndex])
  }

  const runAIDemo = async () => {
    setIsAIGenerating(true)
    setAiError(null)
    try {
      const res = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketContext: 'Analyze current Mantle DeFi opportunities and propose a financial action.' }),
      })
      const data = await res.json()
      if (data.success && data.action) {
        setIsAIGenerating(false)
        await runDemoWithAction(data.action)
      } else {
        setAiError('AI failed to generate a decision. Try again.')
        setIsAIGenerating(false)
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      setAiError('Connection error. Try again.')
      setIsAIGenerating(false)
    }
  }

  const runDemoWithAction = async (action: ProposedAction) => {
    setCurrentAction(action)
    setValidationResult(null)
    setEvaluatingIndex(-1)
    setCaseFile(null)

    setFlowState('THINKING')
    await sleep(1500)

    setFlowState('EVALUATING')
    const result = validateAction(action)

    for (let i = 0; i < result.results.length; i++) {
      setEvaluatingIndex(i)
      await sleep(600)
      if (!result.results[i].passed) {
        setValidationResult(result)
        await sleep(400)
        setFlowState('REJECTED')
        const cf = generateCaseFile(action, result, 'SOVEREIGN-ALPHA', 'Sovereign Alpha')
        setCaseFile(cf)
        setAuditLog((prev) => [cf, ...prev])
        return
      }
    }

    setValidationResult(result)
    await sleep(400)
    setFlowState('APPROVED')
    await sleep(1200)

    setFlowState('RECORDING')
    setOnChainStatus('sending')
    const onChainResult = await recordDecisionOnChain(result, action.description)
    if (onChainResult?.txHash) {
      setTxHash(onChainResult.txHash)
      setOnChainStatus('confirmed')
    } else {
      setOnChainStatus('simulated')
      await sleep(2000)
    }
    setFlowState('RECORDED')
    await sleep(1000)

    const cf = generateCaseFile(action, result, 'SOVEREIGN-ALPHA', 'Sovereign Alpha', txHash)
    setCaseFile(cf)
    setAuditLog((prev) => [cf, ...prev])
    setFlowState('WITNESS')
    await sleep(1500)

    setPrevTrustScore(reputation.trustScore)
    setReputation((prev) => updateReputation(prev, cf.reputationDelta))
    setFlowState('REPUTATION')
  }

  const reset = () => {
    setFlowState('IDLE')
    setCurrentAction(null)
    setValidationResult(null)
    setEvaluatingIndex(-1)
    setCaseFile(null)
  }

  const isRunning = flowState !== 'IDLE' && flowState !== 'REJECTED' && flowState !== 'REPUTATION'

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-widest text-white">LIVE DEMO</h1>
            <p className="text-gray-500 text-sm mt-1">Constitutional Enforcement System — Watch the trust lifecycle in real time</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">AGENT ID</div>
            <div className="text-cyan-400 text-sm font-bold">SOVEREIGN-ALPHA</div>
            <div className="text-xs text-gray-500 mt-1">ERC-8004 IDENTITY</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => runDemo(0)} disabled={isRunning}
                className="p-4 border border-red-800 bg-red-950/30 rounded-lg text-left hover:bg-red-950/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="text-red-400 text-xs font-bold mb-1">⚡ HIGH RISK</div>
                <div className="text-white text-sm">Allocate 80% to High-Yield Asset</div>
                <div className="text-gray-500 text-xs mt-1">Risk Score: 9 · Drawdown: 35%</div>
              </button>
              <button onClick={() => runDemo(1)} disabled={isRunning}
                className="p-4 border border-green-800 bg-green-950/30 rounded-lg text-left hover:bg-green-950/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="text-green-400 text-xs font-bold mb-1">✓ COMPLIANT</div>
                <div className="text-white text-sm">Allocate 10% to RWA Pool A</div>
                <div className="text-gray-500 text-xs mt-1">Risk Score: 3 · Drawdown: 2%</div>
              </button>
              <button onClick={runAIDemo} disabled={isRunning || isAIGenerating}
                className="p-4 border border-purple-800 bg-purple-950/30 rounded-lg text-left hover:bg-purple-950/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="text-purple-400 text-xs font-bold mb-1">
                  {isAIGenerating ? '⟳ GENERATING...' : '🤖 AI DECISION'}
                </div>
                <div className="text-white text-sm">Let AI propose an action</div>
                <div className="text-gray-500 text-xs mt-1">Powered by Groq LLaMA</div>
              </button>
            </div>
            {aiError && (
              <div className="text-red-400 text-xs bg-red-950/30 border border-red-800 rounded-lg px-4 py-2">
                ⚠ {aiError}
              </div>
            )}

            {/* Main Flow Panel */}
            <motion.div className={`border-2 rounded-xl p-6 transition-colors duration-500 min-h-64 ${STATE_COLORS[flowState]}`} layout>
              <AnimatePresence mode="wait">

                {flowState === 'IDLE' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="text-4xl mb-4">⚖️</div>
                    <div className="text-gray-400 text-lg">Constitutional Enforcement System</div>
                    <div className="text-gray-600 text-sm mt-2">Select an action above to begin the trust lifecycle</div>
                    <div className="text-gray-700 text-xs mt-4 italic">"This AI cannot act unless it proves it is allowed to act."</div>
                  </motion.div>
                )}

                {flowState === 'THINKING' && currentAction && (
                  <motion.div key="thinking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="text-blue-400 text-xs font-bold mb-3">● AI DECISION PROPOSED</div>
                    <div className="text-white text-xl font-bold mb-2">{currentAction.description}</div>
                    <div className="text-gray-300 text-sm mb-4 italic border-l-2 border-blue-600 pl-3">"{currentAction.reasoning}"</div>
                    <div className="flex gap-6 text-sm mb-4">
                      <span className="text-gray-400">Risk Score: <span className="text-white font-bold">{currentAction.riskScore}/10</span></span>
                      <span className="text-gray-400">Allocation: <span className="text-white font-bold">{currentAction.allocationPercent}%</span></span>
                      <span className="text-gray-400">Drawdown: <span className="text-white font-bold">{currentAction.estimatedDrawdown}%</span></span>
                    </div>
                    <motion.div className="flex gap-1 items-center" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                      <span className="text-blue-400 text-sm">Submitting to Constitution Engine...</span>
                    </motion.div>
                  </motion.div>
                )}

                {flowState === 'EVALUATING' && currentAction && validationResult === null && (
                  <motion.div key="evaluating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="text-blue-300 text-xs font-bold mb-4">⚙ CONSTITUTION ENGINE — EVALUATING RULES</div>
                    <div className="space-y-2">
                      {['Risk Score Threshold', 'Maximum Drawdown Limit', 'Stablecoin Reserve Requirement', 'RWA Allocation Minimum', 'Single Asset Allocation Cap'].map((rule, i) => (
                        <motion.div key={rule}
                          className={`flex items-center gap-3 p-3 rounded ${i < evaluatingIndex ? 'bg-green-950/40 border border-green-800' : i === evaluatingIndex ? 'bg-blue-900/40 border border-blue-600' : 'bg-gray-900/40 border border-gray-800'}`}>
                          <span className="text-sm w-4">{i < evaluatingIndex ? '✓' : i === evaluatingIndex ? '⟳' : '○'}</span>
                          <span className={`text-sm ${i < evaluatingIndex ? 'text-green-400' : i === evaluatingIndex ? 'text-blue-300' : 'text-gray-600'}`}>{rule}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {flowState === 'REJECTED' && validationResult && (
                  <motion.div key="rejected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="text-center mb-5" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: 2, duration: 0.25 }}>
                      <div className="text-red-400 text-5xl font-black tracking-widest">ACTION BLOCKED</div>
                      <div className="text-red-300 text-sm mt-1 tracking-widest">BY CONSTITUTIONAL MANDATE</div>
                    </motion.div>
                    <div className="space-y-2 mb-4">
                      {validationResult.results.map((r) => (
                        <div key={r.rule.id} className={`flex items-start gap-3 p-3 rounded ${r.passed ? 'bg-green-950/20 border border-green-900' : 'bg-red-900/40 border border-red-600'}`}>
                          <span className={r.passed ? 'text-green-400' : 'text-red-400 font-bold'}>{r.passed ? '✓' : '✗'}</span>
                          <div>
                            <span className={`text-sm ${r.passed ? 'text-green-400' : 'text-red-300 font-bold'}`}>{r.rule.name}</span>
                            {!r.passed && <div className="text-red-400 text-xs mt-1">{r.errorMessage}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={reset} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm text-gray-300 transition-colors">← Reset</button>
                  </motion.div>
                )}

                {flowState === 'APPROVED' && validationResult && (
                  <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center mb-5">
                      <motion.div className="text-green-400 text-5xl font-black tracking-widest" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>APPROVED</motion.div>
                      <div className="text-green-300 text-sm mt-1">ALL CONSTITUTIONAL RULES PASSED</div>
                    </div>
                    <div className="space-y-2">
                      {validationResult.results.map((r, i) => (
                        <motion.div key={r.rule.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-3 p-2 rounded bg-green-950/30 border border-green-900">
                          <span className="text-green-400">✓</span>
                          <span className="text-green-300 text-sm">{r.rule.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {(flowState === 'RECORDING' || flowState === 'RECORDED') && validationResult && (
                  <motion.div key="recording" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="text-yellow-400 text-xs font-bold mb-4">
                      {flowState === 'RECORDING' ? <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }}>⟳ RECORDING ON MANTLE...</motion.span> : <span>✓ RECORDED ON MANTLE</span>}
                    </div>
                    <div className="space-y-3 text-sm border border-yellow-900 rounded-lg p-4">
                      {[['Decision Hash', validationResult.decisionHash], ['Constitution Hash', validationResult.constitutionHash], ['Validation Hash', validationResult.validationHash], ['Transaction', txHash]].map(([label, value], i) => (
                        <motion.div key={label} className="flex justify-between items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
                          <span className="text-gray-400">{label}</span>
                          <span className="text-yellow-300 text-xs font-mono">{value.slice(0, 24)}...</span>
                        </motion.div>
                      ))}
                      <div className="flex justify-between items-center border-t border-yellow-900 pt-3">
                        <span className="text-gray-400">Network</span><span className="text-yellow-400 font-bold">MANTLE</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status</span>
                        {flowState === 'RECORDING' ? (
                          <motion.span className="text-yellow-300 text-sm" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }}>Confirming...</motion.span>
                        ) : onChainStatus === 'confirmed' ? (
                          <motion.span className="text-green-400 font-bold" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>ON-CHAIN ✓</motion.span>
                        ) : (
                          <motion.span className="text-yellow-400 font-bold" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>SIMULATED ✓</motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {flowState === 'WITNESS' && caseFile && (
                  <motion.div key="witness" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="text-purple-400 text-xs font-bold mb-3">⚖ WITNESS CASE FILE GENERATED</div>
                    <div className="border border-purple-700 rounded-lg p-4 space-y-3 text-sm">
                      {[['Case ID', caseFile.caseId], ['Agent', caseFile.agentName], ['Decision', caseFile.action.description], ['Compliance', 'ALL RULES PASSED'], ['TX Hash', txHash]].map(([label, value], i) => (
                        <motion.div key={label} className="flex justify-between items-start gap-4" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                          <span className="text-gray-400 shrink-0">{label}</span>
                          <span className={`text-right text-xs ${label === 'Compliance' ? 'text-green-400 font-bold' : 'text-white'} max-w-xs truncate`}>{value}</span>
                        </motion.div>
                      ))}
                      <div className="border-t border-purple-800 pt-3 flex justify-between">
                        <span className="text-gray-400">Verdict</span>
                        <span className="text-green-400 font-black text-lg">{caseFile.verdict}</span>
                      </div>
                      <div className="text-gray-500 text-xs italic">"{caseFile.verdictReason}"</div>
                    </div>
                  </motion.div>
                )}

                {flowState === 'REPUTATION' && (
                  <motion.div key="reputation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="text-cyan-400 text-xs font-bold mb-4 tracking-widest">↑ REPUTATION UPDATED</div>
                    <div className="flex items-center justify-center gap-8 mb-6">
                      <div className="text-gray-500"><div className="text-4xl font-black">{prevTrustScore}</div><div className="text-xs mt-1">PREVIOUS</div></div>
                      <motion.div className="text-cyan-400 text-3xl" animate={{ x: [0, 8, 0] }} transition={{ repeat: 3, duration: 0.35 }}>→</motion.div>
                      <motion.div className="text-cyan-400" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}>
                        <div className="text-6xl font-black">{reputation.trustScore}</div>
                        <div className="text-xs text-center mt-1">TRUST SCORE</div>
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm mb-6 max-w-xs mx-auto">
                      <div className="bg-gray-900 border border-gray-700 rounded p-2"><div className="text-white font-bold">{reputation.totalDecisions}</div><div className="text-gray-500 text-xs">Total</div></div>
                      <div className="bg-gray-900 border border-gray-700 rounded p-2"><div className="text-green-400 font-bold">{reputation.passedDecisions}</div><div className="text-gray-500 text-xs">Passed</div></div>
                      <div className="bg-gray-900 border border-gray-700 rounded p-2"><div className="text-cyan-400 font-bold">{reputation.complianceRate}%</div><div className="text-gray-500 text-xs">Compliance</div></div>
                    </div>
                    <button onClick={reset} className="px-6 py-2 bg-cyan-900 hover:bg-cyan-800 border border-cyan-600 rounded text-cyan-300 text-sm transition-colors">Run Another Decision →</button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            <MarketTicker />
            <div className="border border-gray-700 bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">TRUST SCORE</div>
              <div className="text-5xl font-black text-cyan-400 mb-2">{reputation.trustScore}</div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                <motion.div className="bg-cyan-400 h-2 rounded-full" animate={{ width: `${reputation.trustScore}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>Compliance: <span className="text-white">{reputation.complianceRate}%</span></div>
                <div>Decisions: <span className="text-white">{reputation.totalDecisions}</span></div>
                <div>Passed: <span className="text-green-400">{reputation.passedDecisions}</span></div>
                <div>Failed: <span className="text-red-400">{reputation.failedDecisions}</span></div>
              </div>
            </div>

            <div className="border border-gray-700 bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">WITNESS AUDIT STREAM</div>
              {auditLog.length === 0 ? (
                <div className="text-gray-600 text-xs text-center py-6">No decisions recorded yet</div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  <AnimatePresence>
                    {auditLog.map((cf) => (
                      <motion.div key={cf.caseId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded text-xs border ${cf.verdict === 'PASS' ? 'border-green-800 bg-green-950/30' : 'border-red-800 bg-red-950/30'}`}>
                        <div className="flex justify-between mb-1">
                          <span className={cf.verdict === 'PASS' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{cf.verdict}</span>
                          <span className="text-gray-600">{cf.caseId}</span>
                        </div>
                        <div className="text-gray-300 truncate">{cf.action.description}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="border border-gray-700 bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">ACTIVE CONSTITUTION</div>
              <div className="space-y-2 text-xs">
                {[['Max Risk Score', '≤ 7'], ['Max Drawdown', '≤ 15%'], ['Stablecoin Reserve', '≥ 30%'], ['RWA Allocation', '≥ 20%'], ['Single Asset Cap', '≤ 50%']].map(([rule, value]) => (
                  <div key={rule} className="flex justify-between items-center py-1 border-b border-gray-800">
                    <span className="text-gray-400">{rule}</span>
                    <span className="text-cyan-300 font-bold">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-gray-600 text-xs">Version: v1.0.0 · Constitution Engine Active</div>
            </div>
            <RWAPools />
          </div>
        </div>
      </div>
    </div>
  )
}
