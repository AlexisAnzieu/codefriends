import { getPayload } from 'payload'
import config from '@/payload.config'
import { CardSelector } from '@/components/CardSelector'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: cards } = await payload.find({
    collection: 'cards',
    limit: 100,
    sort: 'lastName',
  })

  return <CardSelector cards={cards} />
}
