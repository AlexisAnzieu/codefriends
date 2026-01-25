import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { SpymasterGrid } from '@/components/SpymasterGrid'
import type { GridCard } from '@/collections/Games'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: PageProps) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const game = await payload.findByID({
    collection: 'games',
    id,
  })

  if (!game) {
    notFound()
  }

  // Get all card IDs from the grid config
  const gridConfig = game.gridConfig as GridCard[]
  const cardIds = gridConfig.map((gc) => gc.cardId)

  // Fetch all cards used in this game
  const { docs: cards } = await payload.find({
    collection: 'cards',
    where: {
      id: { in: cardIds },
    },
    limit: 100,
  })

  return <SpymasterGrid game={game} cards={cards} />
}
