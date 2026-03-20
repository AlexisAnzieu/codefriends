'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { Card, Media } from '@/payload-types'

interface ExportCardsProps {
  cards: Card[]
  onClose: () => void
}

const getImageUrl = (card: Card): string | null => {
  if (!card.picture) return null
  if (typeof card.picture === 'string') return null
  return (card.picture as Media).url || null
}

export function ExportCards({ cards, onClose }: ExportCardsProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return createPortal(
    <div className="export-overlay fixed inset-0 z-50 bg-gray-900 overflow-auto">
      {/* Controls - hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-gray-900 border-b border-gray-700 p-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          &larr; Back
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Print
        </button>
        <span className="text-gray-400 text-sm">{cards.length} cards</span>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="export-print-area p-6">
        {Array.from({ length: Math.ceil(cards.length / 9) }, (_, pageIndex) => (
          <div key={pageIndex} className="export-page">
            <div className="export-grid">
              {cards.slice(pageIndex * 9, pageIndex * 9 + 9).map((card) => {
                const imageUrl = getImageUrl(card)
                return (
                  <div key={card.id} className="export-card">
                    <div className="export-card-image">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={card.firstName ?? ''}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="export-card-placeholder">
                          {card.firstName?.[0]}
                          {card.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="export-card-info">
                      <span className="export-card-number">#{card.number}</span>
                      <span className="export-card-name">{card.firstName}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
