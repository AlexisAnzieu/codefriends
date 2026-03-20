import Image from 'next/image'
import type { Card, Game, Media } from '@/payload-types'
import type { GridCard } from '@/collections/Games'

interface SpymasterGridProps {
  game: Game
  cards: Card[]
}

const teamColors: Record<string, string> = {
  red: 'bg-team-red',
  blue: 'bg-team-blue',
  neutral: 'bg-team-neutral',
  black: 'bg-team-black',
}

const teamBorders: Record<string, string> = {
  red: 'border-red-400',
  blue: 'border-blue-400',
  neutral: 'border-gray-400',
  black: 'border-gray-600',
}

export function SpymasterGrid({ game, cards }: SpymasterGridProps) {
  const gridConfig = game.gridConfig as GridCard[]
  const gridWidth = game.gridWidth

  // Create a map of card IDs to card data
  const cardMap = new Map(cards.map((card) => [card.id, card]))

  // Sort grid by position
  const sortedGrid = [...gridConfig].sort((a, b) => a.position - b.position)

  // Count teams
  const teamCounts = sortedGrid.reduce(
    (acc, item) => {
      acc[item.team] = (acc[item.team] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const getImageUrl = (card: Card): string | null => {
    if (!card.picture) return null
    if (typeof card.picture === 'string') return null
    return (card.picture as Media).url || null
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{game.name}</h1>
            <p className="text-gray-400 text-sm sm:text-base mt-0.5 sm:mt-1">Spymaster View</p>
          </div>

          {/* Team counts */}
          <div className="flex gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-team-red rounded"></div>
              <span className="text-white text-sm sm:text-base">{teamCounts.red || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-team-blue rounded"></div>
              <span className="text-white text-sm sm:text-base">{teamCounts.blue || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-team-neutral rounded"></div>
              <span className="text-white text-sm sm:text-base">{teamCounts.neutral || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-team-black rounded border border-gray-600"></div>
              <span className="text-white text-sm sm:text-base">{teamCounts.black || 0}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-1.5 sm:gap-2 md:gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          }}
        >
          {sortedGrid.map((gridCard) => {
            const card = cardMap.get(gridCard.cardId)
            if (!card) return null

            const imageUrl = getImageUrl(card)

            return (
              <div
                key={gridCard.cardId}
                className={`
                  relative rounded-lg sm:rounded-xl overflow-hidden
                  ${teamColors[gridCard.team]}
                  border-2 sm:border-4 ${teamBorders[gridCard.team]}
                `}
              >
                {/* Picture */}
                <div className="aspect-square relative">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${card.firstName} ${card.lastName}`}
                      fill
                      sizes="(max-width: 640px) 20vw, (max-width: 768px) 15vw, 200px"
                      className="object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 text-lg sm:text-2xl md:text-4xl font-bold">
                      {card.firstName?.[0]}
                      {card.lastName?.[0]}
                    </div>
                  )}

                  {/* Team overlay */}
                  <div className={`absolute inset-0 ${teamColors[gridCard.team]} opacity-40`} />
                </div>

                {/* Card info */}
                <div className="p-0.5 sm:p-2 text-center bg-black/30">
                  <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm truncate">
                    {card.firstName} {card.lastName}
                  </p>
                  {card.number && (
                    <p className="text-white/70 text-[8px] sm:text-[10px] md:text-xs">
                      #{card.number}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-8 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-team-red rounded"></div>
            <span className="text-white">Team Red</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-team-blue rounded"></div>
            <span className="text-white">Team Blue</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-team-neutral rounded"></div>
            <span className="text-white">Neutral</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-team-black rounded border border-gray-600"></div>
            <span className="text-white">Assassin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
