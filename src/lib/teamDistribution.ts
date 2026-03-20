import type { Team, GridCard } from '../collections/Games'

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Calculates team distribution based on card count
 * Always 1 black card, rest distributed proportionally:
 * - Red: ~40%
 * - Blue: ~35%
 * - Neutral: remaining
 */
function calculateTeamCounts(totalCards: number): Record<Team, number> {
  const black = 1
  const remaining = totalCards - black

  const red = Math.ceil(remaining * 0.4)
  const blue = Math.ceil(remaining * 0.35)
  const neutral = remaining - red - blue

  return { red, blue, neutral, black }
}

/**
 * Calculates optimal grid dimensions for a given card count.
 * Picks a width (max 5) and computes the height to fit all cards.
 */
export function calculateGridDimensions(cardCount: number): {
  width: number
  height: number
} {
  if (cardCount <= 4) {
    return { width: Math.min(cardCount, 2), height: Math.ceil(cardCount / 2) }
  }

  const width = Math.min(cardCount, 5)
  const height = Math.ceil(cardCount / width)
  return { width, height }
}

/**
 * Creates a game grid configuration from selected card IDs
 * Shuffles cards and assigns teams proportionally
 */
export function createGridConfig(cardIds: string[]): {
  gridConfig: GridCard[]
  gridWidth: number
  gridHeight: number
} {
  if (cardIds.length < 4) {
    throw new Error('Minimum 4 cards required to create a game')
  }

  const { width, height } = calculateGridDimensions(cardIds.length)
  const teamCounts = calculateTeamCounts(cardIds.length)

  // Create team assignments array
  const teams: Team[] = [
    ...Array(teamCounts.red).fill('red' as Team),
    ...Array(teamCounts.blue).fill('blue' as Team),
    ...Array(teamCounts.neutral).fill('neutral' as Team),
    ...Array(teamCounts.black).fill('black' as Team),
  ]

  // Shuffle both cards and team assignments
  const shuffledCardIds = shuffle(cardIds)
  const shuffledTeams = shuffle(teams)

  // Create grid configuration
  const gridConfig: GridCard[] = shuffledCardIds.map((cardId, index) => ({
    cardId,
    position: index,
    team: shuffledTeams[index],
  }))

  return {
    gridConfig,
    gridWidth: width,
    gridHeight: height,
  }
}
