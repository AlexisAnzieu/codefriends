import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { createGridConfig } from '@/lib/teamDistribution'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, cardIds } = body

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 4) {
      return NextResponse.json({ error: 'At least 4 card IDs are required' }, { status: 400 })
    }

    if (cardIds.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 cards allowed' }, { status: 400 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Generate grid configuration with team assignments
    const { gridConfig, gridWidth, gridHeight } = createGridConfig(cardIds)

    // Create the game
    const game = await payload.create({
      collection: 'games',
      data: {
        name: name || `Game ${new Date().toLocaleDateString()}`,
        gridConfig,
        gridWidth,
        gridHeight,
      },
    })

    return NextResponse.json({ doc: game })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
