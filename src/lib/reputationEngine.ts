// Reputation Engine
// Trust is earned through consistent, constitutional behavior

export interface SovereignReputation {
  agentId: string
  agentName: string
  trustScore: number // 0-100
  totalDecisions: number
  passedDecisions: number
  failedDecisions: number
  complianceRate: number // percentage
  lastUpdated: number
}

export function createInitialReputation(agentId: string, agentName: string): SovereignReputation {
  return {
    agentId,
    agentName,
    trustScore: 75,
    totalDecisions: 12,
    passedDecisions: 10,
    failedDecisions: 2,
    complianceRate: 83,
    lastUpdated: Date.now(),
  }
}

export function updateReputation(
  reputation: SovereignReputation,
  delta: number
): SovereignReputation {
  const newScore = Math.min(100, Math.max(0, reputation.trustScore + delta))
  const newPassed = delta > 0 ? reputation.passedDecisions + 1 : reputation.passedDecisions
  const newFailed = delta === 0 ? reputation.failedDecisions + 1 : reputation.failedDecisions
  const newTotal = reputation.totalDecisions + 1

  return {
    ...reputation,
    trustScore: newScore,
    totalDecisions: newTotal,
    passedDecisions: newPassed,
    failedDecisions: newFailed,
    complianceRate: Math.round((newPassed / newTotal) * 100),
    lastUpdated: Date.now(),
  }
}
