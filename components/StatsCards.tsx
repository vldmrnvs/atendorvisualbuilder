'use client'
export default function StatsCards() {
  const stats = [
    { name: 'Active Bots', value: 3 },
    { name: 'Usage', value: '1.2k msgs' },
    { name: 'Memory', value: '256MB' },
  ]
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="p-4 bg-white rounded shadow text-center"
        >
          <div className="text-sm text-gray-500">{stat.name}</div>
          <div className="text-xl font-semibold">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}
