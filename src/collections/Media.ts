import type { CollectionConfig } from 'payload'
import { stylizeMediaHook } from '../hooks/stylizeImage'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [stylizeMediaHook],
  },
  fields: [],
  upload: true,
}
