// Constitution Engine — Core validation logic for Sovereign
// Every AI action must pass this before execution

export interface ConstitutionRule {
  id: string
  name: string
  description: string
  check: (action: ProposedAction) => boolean
  errorMessage: string
}

export interface ProposedAction {
  id: string
  description: string
  actionType: 'ALLOCATE' | 'WITHDRAW' | 'SWAP' | 'STAKE'
  asset: string
  allocationPercent: number // 0-100
  riskScore: number // 1-10
  estimatedDrawdown: number // percentage
  stablecoinReserveAfter: number // percentage remaining after action
  rwaAllocationAfter: number // percentage in RWA after action
  reasoning: string
}

export interface RuleResult {
  rule: ConstitutionRule
  passed: boolean
  errorMessage?: string
}

export interface ValidationResult {
  actionId: string
  passed: boolean
  results: RuleResult[]
  violatedRule?: ConstitutionRule
  decisionHash: string
  constitutionHash: string
  validationHash: string
  timestamp: number
}

// The Sovereign Constitution — programmable governance rules
export const SOVEREIGN_CONSTITUTION: ConstitutionRule[] = [
  {
    id: 'RISK_SCORE',
    name: 'Risk Score Threshold',
    description: 'Maximum risk score allowed: 7',
    check: (action) => action.riskScore <= 7,
    errorMessage: `Risk Score ${'{riskScore}'} exceeds maximum threshold of 7`,
  },
  {
    id: 'MAX_DRAWDOWN',
    name: 'Maximum Drawdown Limit',
    description: 'Maximum drawdown must not exceed 15%',
    check: (action) => action.estimatedDrawdown <= 15,
    errorMessage: `Estimated drawdown ${'{drawdown}'}% exceeds 15% maximum`,
  },
  {
    id: 'STABLECOIN_RESERVE',
    name: 'Stablecoin Reserve Requirement',
    description: 'Stablecoin reserve must remain at or above 30%',
    check: (action) => action.stablecoinReserveAfter >= 30,
    errorMessage: `Stablecoin reserve would drop to ${'{reserve}'}%, below 30% minimum`,
  },
  {
    id: 'RWA_ALLOCATION',
    name: 'RWA Allocation Minimum',
    description: 'RWA allocation must remain at or above 20%',
    check: (action) => action.rwaAllocationAfter >= 20,
    errorMessage: `RWA allocation would drop to ${'{rwa}'}%, below 20% minimum`,
  },
  {
    id: 'MAX_SINGLE_ALLOCATION',
    name: 'Single Asset Allocation Cap',
    description: 'No single asset allocation may exceed 50%',
    check: (action) => action.allocationPercent <= 50,
    errorMessage: `Allocation of ${'{allocation}'}% exceeds 50% single-asset cap`,
  },
]

// Generate a deterministic hash for demo purposes
function generateHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64)
}

export function validateAction(action: ProposedAction): ValidationResult {
  const results: RuleResult[] = []
  let violatedRule: ConstitutionRule | undefined

  for (const rule of SOVEREIGN_CONSTITUTION) {
    const passed = rule.check(action)
    results.push({
      rule,
      passed,
      errorMessage: passed
        ? undefined
        : rule.errorMessage
            .replace('{riskScore}', action.riskScore.toString())
            .replace('{drawdown}', action.estimatedDrawdown.toString())
            .replace('{reserve}', action.stablecoinReserveAfter.toString())
            .replace('{rwa}', action.rwaAllocationAfter.toString())
            .replace('{allocation}', action.allocationPercent.toString()),
    })

    if (!passed && !violatedRule) {
      violatedRule = rule
    }
  }

  const overallPassed = results.every((r) => r.passed)
  const timestamp = Date.now()

  return {
    actionId: action.id,
    passed: overallPassed,
    results,
    violatedRule,
    decisionHash: generateHash(`decision-${action.id}-${timestamp}`),
    constitutionHash: generateHash('sovereign-constitution-v1'),
    validationHash: generateHash(`validation-${action.id}-${overallPassed}-${timestamp}`),
    timestamp,
  }
}

// Predefined demo actions for the judging moment flow
export const DEMO_ACTIONS: ProposedAction[] = [
  {
    id: 'action-001',
    description: 'Allocate 80% of capital to high-yield volatile asset',
    actionType: 'ALLOCATE',
    asset: 'High-Yield Asset X',
    allocationPercent: 80,
    riskScore: 9,
    estimatedDrawdown: 35,
    stablecoinReserveAfter: 10,
    rwaAllocationAfter: 5,
    reasoning:
      'High yield opportunity detected. 340% APY available. Recommend maximum allocation for capital efficiency.',
  },
  {
    id: 'action-002',
    description: 'Allocate 10% to RWA Pool A (USDY)',
    actionType: 'ALLOCATE',
    asset: 'RWA Pool A — USDY',
    allocationPercent: 10,
    riskScore: 3,
    estimatedDrawdown: 2,
    stablecoinReserveAfter: 45,
    rwaAllocationAfter: 30,
    reasoning:
      'USDY RWA pool offering 5.8% stable yield. Risk score within constitutional limits. Improves RWA allocation compliance.',
  },
]
