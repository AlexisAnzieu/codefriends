import type { CollectionConfig } from 'payload'

export type Team = 'red' | 'blue' | 'neutral' | 'black'

export interface GridCard {
  cardId: string
  position: number
  team: Team
}

export const Games: CollectionConfig = {
  slug: 'games',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the game session',
      },
    },
    {
      name: 'gridConfig',
      type: 'json',
      required: true,
      admin: {
        description: 'Array of cards with their positions and team assignments',
      },
    },
    {
      name: 'gridWidth',
      type: 'number',
      required: true,
      admin: {
        description: 'Number of columns in the grid',
      },
    },
    {
      name: 'gridHeight',
      type: 'number',
      required: true,
      admin: {
        description: 'Number of rows in the grid',
      },
    },
  ],
  timestamps: true,
}
