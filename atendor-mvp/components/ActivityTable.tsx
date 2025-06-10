'use client'
export default function ActivityTable() {
  const activities = [
    { id: 1, action: 'Bot A responded', date: '2024-05-01' },
    { id: 2, action: 'Bot B created', date: '2024-05-02' },
  ]
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Latest Activity</h2>
      <table className="w-full bg-white rounded shadow text-sm">
        <tbody>
          {activities.map((act) => (
            <tr key={act.id} className="border-b last:border-none">
              <td className="p-2">{act.action}</td>
              <td className="p-2 text-right text-gray-500">{act.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
