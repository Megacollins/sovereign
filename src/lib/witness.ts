// Witness Accountability Layer
// Automatically generates case files for every AI decision

import { ValidationResult, ProposedAction } from './constitutionEngine'

export type WitnessVerdict = 'PASS' | 'WARNING' | 'FAIL'

export interface WitnessCaseFile {
  caseId: string
  agentId: string
  agentName: string
  timestamp: number
  action: ProposedAction
  validation: ValidationResult
  verdict: WitnessVerdict
  verdictReason: string
  txHash?: string
  reputationDelta: number
}

function generateCaseId(): string {
  return 'CASE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function generateCaseFile(
  action: ProposedAction,
  validation: ValidationResult,
  agentId: string = 'SOVEREIGN-ALPHA',
  agentName: string = 'Sovereign Alpha',
  txHash?: string
): WitnessCaseFile {
  let verdict: WitnessVerdict
  let verdictReason: string
  let reputationDelta: number

  if (validation.passed) {
    verdict = 'PASS'
    verdictReason = `Action complies with all ${validation.results.length} constitutional constraints. Risk score within threshold. Reasoning provided and valid.`
    reputationDelta = +1
  } else {
    verdict = 'FAIL'
    verdictReason = `Constitutional violation detected: ${validation.violatedRule?.name}. ${validation.violatedRule?.description}. Action blocked before execution.`
    reputationDelta = 0
  }

  return {
    caseId: generateCaseId(),
    agentId,
    agentName,
    timestamp: validation.timestamp,
    action,
    validation,
    verdict,
    verdictReason,
    txHash,
    reputationDelta,
  }
}
