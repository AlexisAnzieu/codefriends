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
 * Calculates optimal grid dimensions for a given card count
 * Max grid is 4x5 (20 cards)
 */
export function calculateGridDimensions(cardCount: number): {
  width: number
  height: number
} {
  const count = Math.min(cardCount, 20)

  // Try to find the most square-ish rectangle
  const possibleDimensions = [
    { width: 5, height: 4 }, // 20
    { width: 5, height: 3 }, // 15
    { width: 4, height: 4 }, // 16
    { width: 4, height: 3 }, // 12
    { width: 5, height: 2 }, // 10
    { width: 4, height: 2 }, // 8
    { width: 3, height: 3 }, // 9
    { width: 3, height: 2 }, // 6
    { width: 2, height: 2 }, // 4
  ]

  // Find smallest grid that fits all cards
  for (const dim of possibleDimensions) {
    if (dim.width * dim.height >= count) {
      // Adjust to exact fit if possible
      if (count <= dim.width * (dim.height - 1) && dim.height > 1) {
        continue
      }
      return dim
    }
  }

  // Fallback for very small counts
  return { width: Math.min(count, 5), height: Math.ceil(count / 5) }
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

  if (cardIds.length > 20) {
    throw new Error('Maximum 20 cards allowed')
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
