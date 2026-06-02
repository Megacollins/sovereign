'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AssetData {
  symbol: string
  name: string
  price: number
  change24h: number
  riskScore: number
  volatility: number
}

interface MarketData {
  success: boolean
  assets: AssetData[]
  marketSentiment: string
  avgRiskScore: number
  timestamp: number
  fallback?: boolean
}

const SENTIMENT_COLORS: Record<string, string> = {
  CALM: 'text-green-400',
  NEUTRAL: 'text-cyan-400',
  VOLATILE: 'text-yellow-400',
  EXTREME: 'text-red-400',
}

export default function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchMarket = async () => {
    try {
      const res = await fetch('/api/market')
      const data = await res.json()
      setMarketData(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {
      console.error('Failed to fetch market data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarket()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarket, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="border border-gray-700 bg-gray-900 rounded-xl p-4 mb-4">
        <div className="text-gray-400 text-xs font-bold mb-3 tracking-widest">LIVE MARKET DATA — BYBIT</div>
        <motion.div className="text-gray-600 text-xs text-center py-2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          Fetching live data from Bybit...
        </motion.div>
      </div>
    )
  }

  if (!marketData) return null

  return (
    <div className="border border-gray-700 bg-gray-900 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-gray-400 text-xs font-bold tracking-widest">
          LIVE MARKET — BYBIT {marketData.fallback && <span className="text-yellow-600">(CACHED)</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${SENTIMENT_COLORS[marketData.marketSentiment] || 'text-gray-400'}`}>
            {marketData.marketSentiment}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {marketData.assets.map((asset) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between py-1.5 border-b border-gray-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold">{asset.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  asset.riskScore <= 3 ? 'bg-green-950 text-green-400' :
                  asset.riskScore <= 6 ? 'bg-yellow-950 text-yellow-400' :
                  'bg-red-950 text-red-400'
                }`}>
                  Risk {asset.riskScore}/10
                </span>
              </div>
              <div className="text-right">
                <div className="text-white text-xs font-bold">
                  ${asset.price > 100 ? asset.price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : asset.price.toFixed(4)}
                </div>
                <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-gray-600 text-xs">Avg Market Risk: <span className="text-white">{marketData.avgRiskScore}/10</span></span>
        <span className="text-gray-700 text-xs">Updated {lastUpdated}</span>
      </div>
    </div>
  )
}
