import { NextResponse } from 'next/server'

// Bybit public market data API — no auth required
const BYBIT_BASE = 'https://api.bybit.com/v5/market'

// Assets we track for Sovereign
const TRACKED_SYMBOLS = ['MNTUSDT', 'ETHUSDT', 'BTCUSDT']

interface BybitTicker {
  symbol: string
  lastPrice: string
  price24hPcnt: string
  highPrice24h: string
  lowPrice24h: string
  volume24h: string
  turnover24h: string
}

interface AssetData {
  symbol: string
  name: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  riskScore: number
  volatility: number
}

function calculateRiskScore(change24h: number, high24h: number, low24h: number, price: number): number {
  // Volatility = (high - low) / price * 100
  const volatility = ((high24h - low24h) / price) * 100
  const absChange = Math.abs(change24h)

  // Risk score 1-10 based on volatility and price change
  let score = 1

  if (volatility > 20) score = 9
  else if (volatility > 15) score = 8
  else if (volatility > 10) score = 7
  else if (volatility > 7) score = 6
  else if (volatility > 5) score = 5
  else if (volatility > 3) score = 4
  else if (volatility > 2) score = 3
  else if (volatility > 1) score = 2
  else score = 1

  // Boost score if large price movement
  if (absChange > 10) score = Math.min(10, score + 2)
  else if (absChange > 5) score = Math.min(10, score + 1)

  return Math.min(10, Math.max(1, score))
}

const ASSET_NAMES: Record<string, string> = {
  MNTUSDT: 'MNT (Mantle)',
  ETHUSDT: 'ETH',
  BTCUSDT: 'BTC',
}

export async function GET() {
  try {
    // Fetch each symbol individually for reliability
    const tickerPromises = TRACKED_SYMBOLS.map((symbol) =>
      fetch(`${BYBIT_BASE}/tickers?category=spot&symbol=${symbol}`)
        .then((r) => r.json())
        .then((d) => d.result?.list?.[0] as BybitTicker | undefined)
        .catch(() => undefined)
    )

    const tickerResults = await Promise.all(tickerPromises)

    // Map results to symbols
    const tickerMap: Record<string, BybitTicker | undefined> = {}
    TRACKED_SYMBOLS.forEach((symbol, i) => {
      tickerMap[symbol] = tickerResults[i]
    })

    const assets: AssetData[] = TRACKED_SYMBOLS.map((symbol) => {
      const ticker = tickerMap[symbol]

      if (!ticker) {
        // Fallback data if symbol not found
        return {
          symbol,
          name: ASSET_NAMES[symbol] || symbol,
          price: 0,
          change24h: 0,
          high24h: 0,
          low24h: 0,
          volume24h: 0,
          riskScore: 5,
          volatility: 0,
        }
      }

      const price = parseFloat(ticker.lastPrice)
      const change24h = parseFloat(ticker.price24hPcnt) * 100
      const high24h = parseFloat(ticker.highPrice24h)
      const low24h = parseFloat(ticker.lowPrice24h)
      const volume24h = parseFloat(ticker.volume24h)
      const volatility = price > 0 ? ((high24h - low24h) / price) * 100 : 0
      const riskScore = calculateRiskScore(change24h, high24h, low24h, price)

      return {
        symbol,
        name: ASSET_NAMES[symbol] || symbol,
        price,
        change24h,
        high24h,
        low24h,
        volume24h,
        riskScore,
        volatility: Math.round(volatility * 100) / 100,
      }
    })

    // Calculate market sentiment
    const avgRiskScore = Math.round(
      assets.reduce((sum, a) => sum + a.riskScore, 0) / assets.length
    )

    const marketSentiment =
      avgRiskScore <= 3 ? 'CALM' :
      avgRiskScore <= 5 ? 'NEUTRAL' :
      avgRiskScore <= 7 ? 'VOLATILE' : 'EXTREME'

    return NextResponse.json({
      success: true,
      assets,
      marketSentiment,
      avgRiskScore,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Market API error:', error)

    // Return fallback data so demo never breaks
    return NextResponse.json({
      success: false,
      assets: [
        { symbol: 'MNTUSDT', name: 'MNT (Mantle)', price: 0.74, change24h: -0.8, high24h: 0.76, low24h: 0.72, volume24h: 1200000, riskScore: 4, volatility: 5.4 },
        { symbol: 'ETHUSDT', name: 'ETH', price: 2580, change24h: 1.2, high24h: 2620, low24h: 2540, volume24h: 890000, riskScore: 4, volatility: 3.1 },
        { symbol: 'BTCUSDT', name: 'BTC', price: 103000, change24h: 0.5, high24h: 104000, low24h: 102000, volume24h: 2100000, riskScore: 3, volatility: 1.9 },
      ],
      marketSentiment: 'NEUTRAL',
      avgRiskScore: 4,
      timestamp: Date.now(),
      fallback: true,
    })
  }
}
