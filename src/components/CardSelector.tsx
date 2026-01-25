'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Card, Media } from '@/payload-types'

interface CardSelectorProps {
  cards: Card[]
}

export function CardSelector({ cards }: CardSelectorProps) {
  const router = useRouter()
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [gameName, setGameName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleCard = (cardId: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId)
      }
      if (prev.length >= 20) {
        return prev
      }
      return [...prev, cardId]
    })
  }

  const selectAll = () => {
    setSelectedCards(cards.slice(0, 20).map((c) => c.id))
  }

  const deselectAll = () => {
    setSelectedCards([])
  }

  const createGame = async () => {
    if (selectedCards.length < 4) {
      setError('Select at least 4 cards')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gameName || `Game ${new Date().toLocaleDateString()}`,
          cardIds: selectedCards,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create game')
      }

      const data = await response.json()
      router.push(`/games/${data.doc.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game')
    } finally {
      setIsCreating(false)
    }
  }

  const getImageUrl = (card: Card): string | null => {
    if (!card.picture) return null
    if (typeof card.picture === 'string') return null
    return (card.picture as Media).url || null
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Create New Game</h1>

        {/* Game name input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Game name (optional)"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Selection controls */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-white">Selected: {selectedCards.length}/20</span>
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Deselect All
          </button>
          <button
            onClick={createGame}
            disabled={selectedCards.length < 4 || isCreating}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Game'}
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg">{error}</div>}

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => {
            const isSelected = selectedCards.includes(card.id)
            const imageUrl = getImageUrl(card)

            return (
              <div
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={`
                  relative cursor-pointer rounded-xl overflow-hidden transition-all
                  ${isSelected ? 'ring-4 ring-blue-500 scale-105' : 'ring-2 ring-gray-700 hover:ring-gray-500'}
                `}
              >
                {/* Picture */}
                <div className="aspect-square bg-gray-800 relative">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${card.firstName} ${card.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                      {card.firstName?.[0]}
                      {card.lastName?.[0]}
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="p-3 bg-gray-800">
                  <p className="text-white font-semibold text-sm truncate">
                    {card.firstName} {card.lastName}
                  </p>
                  {card.number && <p className="text-gray-400 text-xs">#{card.number}</p>}
                </div>
              </div>
            )
          })}
        </div>

        {cards.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p>No cards found. Add some cards in the admin panel first.</p>
            <Link
              href="/admin/collections/cards"
              className="text-blue-400 hover:underline mt-2 inline-block"
            >
              Go to Cards Collection →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
