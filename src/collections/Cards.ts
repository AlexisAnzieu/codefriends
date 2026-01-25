import type { CollectionConfig } from 'payload'

export const Cards: CollectionConfig = {
  slug: 'cards',
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['number', 'firstName', 'lastName', 'picture'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-assign number on create
        if (operation === 'create' && data?.number === undefined) {
          const { docs } = await req.payload.find({
            collection: 'cards',
            sort: '-number',
            limit: 1,
            depth: 0,
          })

          const maxNumber = docs[0]?.number ?? 0
          data.number = maxNumber + 1
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },

    {
      name: 'picture',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture for the card',
      },
    },
    {
      name: 'number',
      type: 'number',
      admin: {
        description: 'Auto-assigned player number',
        readOnly: true,
      },
    },
  ],
}
