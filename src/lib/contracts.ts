// Contract interaction layer — wires frontend to Mantle contracts
import { createPublicClient, createWalletClient, custom, http, defineChain } from 'viem'
import { ValidationResult } from './constitutionEngine'

export const mantleTestnet = defineChain({
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
})

// Contract ABIs (minimal — only what we need)
const PROOF_REGISTRY_ABI = [
  {
    name: 'recordDecision',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sovereignId', type: 'uint256' },
      { name: 'decisionHash', type: 'bytes32' },
      { name: 'constitutionHash', type: 'bytes32' },
      { name: 'validationHash', type: 'bytes32' },
      { name: 'approved', type: 'bool' },
      { name: 'actionDescription', type: 'string' },
    ],
    outputs: [{ name: 'proofId', type: 'uint256' }],
  },
] as const

const REPUTATION_REGISTRY_ABI = [
  {
    name: 'initializeReputation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'sovereignId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'updateReputation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sovereignId', type: 'uint256' },
      { name: 'approved', type: 'bool' },
      { name: 'proofId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

// Convert hex string to bytes32
function toBytes32(hex: string): `0x${string}` {
  const clean = hex.replace('0x', '').slice(0, 64).padEnd(64, '0')
  return `0x${clean}` as `0x${string}`
}

export async function recordDecisionOnChain(
  validation: ValidationResult,
  actionDescription: string,
  sovereignId: bigint = 1n
): Promise<{ txHash: string; proofId?: string } | null> {
  try {
    // Check if MetaMask is available
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('No wallet detected — using simulated proof')
      return null
    }

    const proofRegistryAddress = process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS as `0x${string}`
    if (!proofRegistryAddress) {
      console.log('Contract address not configured')
      return null
    }

    // Request wallet connection
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    const walletClient = createWalletClient({
      chain: mantleTestnet,
      transport: custom(window.ethereum),
    })

    const publicClient = createPublicClient({
      chain: mantleTestnet,
      transport: http(),
    })

    const [address] = await walletClient.getAddresses()

    // Switch to Mantle testnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x138B' }], // 5003 in hex
      })
    } catch {
      // Add network if not present
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x138B',
          chainName: 'Mantle Sepolia',
          nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
          rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
          blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz'],
        }],
      })
    }

    // Send transaction to ProofRegistry
    const txHash = await walletClient.writeContract({
      address: proofRegistryAddress,
      abi: PROOF_REGISTRY_ABI,
      functionName: 'recordDecision',
      args: [
        sovereignId,
        toBytes32(validation.decisionHash),
        toBytes32(validation.constitutionHash),
        toBytes32(validation.validationHash),
        validation.passed,
        actionDescription,
      ],
      account: address,
      chain: mantleTestnet,
    })

    // Wait for receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    console.log('Decision recorded on Mantle:', txHash)

    return { txHash, proofId: receipt.blockNumber?.toString() }
  } catch (error) {
    console.error('On-chain recording failed:', error)
    return null
  }
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }
  }
}
