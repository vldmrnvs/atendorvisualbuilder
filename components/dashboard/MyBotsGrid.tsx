'use client'
import BotCard, { BotInfo } from './BotCard'
import CreateBotCard from './CreateBotCard'

export default function MyBotsGrid({ bots }: { bots: BotInfo[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {bots.map((b) => (
        <BotCard key={b.id} bot={b} />
      ))}
      <CreateBotCard />
    </div>
  )
}
