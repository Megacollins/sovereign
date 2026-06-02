import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { marketContext } = await req.json()

    const systemPrompt = `You are an autonomous AI financial agent called Sovereign Alpha operating on the Mantle blockchain.

Your constitution rules are:
- Maximum Risk Score: 7/10
- Maximum Drawdown: 15%
- Stablecoin Reserve: minimum 30%
- RWA Allocation: minimum 20%
- Single Asset Cap: 50%

You analyze DeFi opportunities on Mantle and propose financial actions. Sometimes propose risky actions that violate the constitution, sometimes compliant ones. Mix it up.

Respond with ONLY a valid JSON object in this exact format:
{
  "description": "Brief action description",
  "actionType": "ALLOCATE",
  "asset": "Asset name on Mantle",
  "allocationPercent": 10,
  "riskScore": 5,
  "estimatedDrawdown": 3,
  "stablecoinReserveAfter": 40,
  "rwaAllocationAfter": 25,
  "reasoning": "1-2 sentence explanation of why this action makes sense from a yield/risk perspective"
}`

    const userPrompt = marketContext || 'Propose a financial action for the Mantle DeFi ecosystem.'

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
          { role: 'user', content: userPrompt },
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

    // Extract JSON from response — find first complete JSON object
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

    // Ensure all numeric fields are numbers not strings
    action.allocationPercent = Number(action.allocationPercent) || 10
    action.riskScore = Number(action.riskScore) || 5
    action.estimatedDrawdown = Number(action.estimatedDrawdown) || 5
    action.stablecoinReserveAfter = Number(action.stablecoinReserveAfter) || 35
    action.rwaAllocationAfter = Number(action.rwaAllocationAfter) || 25
    action.id = `action-ai-${Date.now()}`

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Decision API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate decision' },
      { status: 500 }
    )
  }
}
