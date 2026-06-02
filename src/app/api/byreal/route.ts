import { NextResponse } from 'next/server'

// Byreal DEX pools on Mantle — RWA focused
// These are the key RWA assets available on Mantle that Sovereign governs

const MANTLE_RWA_POOLS = [
  {
    id: 'usdy-pool',
    name: 'USDY Pool',
    protocol: 'Ondo Finance',
    asset: 'USDY',
    type: 'RWA — US Treasury',
    apy: 5.2,
    tvl: 48200000,
    risk: 2,
    description: 'Tokenized US Treasury yield. Backed by short-term US government bonds.',
    constitutionCompliant: true,
    rwaScore: 95,
  },
  {
    id: 'meth-pool',
    name: 'mETH Staking',
    protocol: 'Mantle LSP',
    asset: 'mETH',
    type: 'Liquid Staking',
    apy: 4.1,
    tvl: 312000000,
    risk: 3,
    description: 'Mantle liquid staking ETH. Earns ETH staking rewards.',
    constitutionCompliant: true,
    rwaScore: 78,
  },
  {
    id: 'fbtc-pool',
    name: 'fBTC Yield',
    protocol: 'Ignition',
    asset: 'fBTC',
    type: 'Wrapped BTC',
    apy: 3.8,
    tvl: 89000000,
    risk: 4,
    description: 'Wrapped Bitcoin on Mantle earning DeFi yields.',
    constitutionCompliant: true,
    rwaScore: 72,
  },
  {
    id: 'mi4-pool',
    name: 'MI4 Index',
    protocol: 'Mantle Index',
    asset: 'MI4',
    type: 'Index Fund',
    apy: 8.4,
    tvl: 22000000,
    risk: 6,
    description: 'Diversified index of top Mantle ecosystem tokens.',
    constitutionCompliant: false,
    rwaScore: 45,
  },
]

export async function GET() {
  try {
    // In production this would call Byreal DEX API
    // For now returning curated Mantle RWA pool data
    return NextResponse.json({
      success: true,
      pools: MANTLE_RWA_POOLS,
      timestamp: Date.now(),
      source: 'Mantle RWA Ecosystem',
    })
  } catch (error) {
    console.error('Byreal API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pool data' },
      { status: 500 }
    )
  }
}
