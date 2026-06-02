import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { marketContext } = await req.json()

    // Fetch real market data from Bybit
    let marketData = null
    try {
      const marketRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/market`)
      if (marketRes.ok) {
        marketData = await marketRes.json()
      }
    } catch {
      console.log('Market data unavailable, using generic context')
    }

    // Build market context string from real data
    let realMarketContext = marketContext || 'Analyze Mantle DeFi opportunities.'

    if (marketData?.success && marketData.assets) {
      const assetSummary = marketData.assets
        .map((a: { name: string; price: number; change24h: number; riskScore: number; volatility: number }) =>
          `${a.name}: $${a.price.toFixed(2)} (${a.change24h > 0 ? '+' : ''}${a.change24h.toFixed(2)}% 24h, Risk: ${a.riskScore}/10, Volatility: ${a.volatility}%)`
        )
        .join('\n')

      realMarketContext = `Current Mantle DeFi market conditions:
${assetSummary}
Market Sentiment: ${marketData.marketSentiment}
Average Risk Score: ${marketData.avgRiskScore}/10

Based on these REAL market conditions, propose a financial action. Sometimes propose risky actions that violate the constitution to demonstrate enforcement.`
    }

    const systemPrompt = `You are an autonomous AI financial agent called Sovereign Alpha operating on the Mantle blockchain.

Your constitution rules are:
- Maximum Risk Score: 7/10
- Maximum Drawdown: 15%
- Stablecoin Reserve: minimum 30%
- RWA Allocation: minimum 20%
- Single Asset Cap: 50%

You analyze real DeFi opportunities on Mantle and propose financial actions based on current market conditions.
Sometimes propose risky actions that violate the constitution (to demonstrate enforcement), and sometimes compliant ones.

Assets on Mantle to consider: MNT, USDY (Ondo), mETH (Mantle ETH), fBTC

Respond with ONLY a valid JSON object:
{
  "description": "Brief action description mentioning specific asset",
  "actionType": "ALLOCATE",
  "asset": "Specific asset name",
  "allocationPercent": 10,
  "riskScore": 5,
  "estimatedDrawdown": 3,
  "stablecoinReserveAfter": 40,
  "rwaAllocationAfter": 25,
  "reasoning": "1-2 sentence explanation referencing actual market conditions"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: realMarketContext },
        ],
        temperature: 0.9,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      throw new Error('Groq API request failed')
    }

    const data = await response.json()

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No choices returned from Groq API')
    }

    const content = data.choices[0]?.message?.content
    if (!content) throw new Error('Empty content from Groq API')

    const start = content.indexOf('{')
    const end = content.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON found in response')
    const jsonStr = content.slice(start, end + 1)

    let action
    try {
      action = JSON.parse(jsonStr)
    } catch {
      throw new Error('Failed to parse JSON from AI response')
    }

    // Ensure all numeric fields are numbers
    action.allocationPercent = Number(action.allocationPercent) || 10
    action.riskScore = Number(action.riskScore) || 5
    action.estimatedDrawdown = Number(action.estimatedDrawdown) || 5
    action.stablecoinReserveAfter = Number(action.stablecoinReserveAfter) || 35
    action.rwaAllocationAfter = Number(action.rwaAllocationAfter) || 25
    action.id = `action-ai-${Date.now()}`

    return NextResponse.json({
      success: true,
      action,
      marketData: marketData?.assets || null,
    })
  } catch (error) {
    console.error('Decision API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate decision' },
      { status: 500 }
    )
  }
}
