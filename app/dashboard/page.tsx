import HeaderDashboard from '@/components/HeaderDashboard'
import StatsCards from '@/components/StatsCards'
import ActivityTable from '@/components/ActivityTable'

export default function DashboardPage() {
  return (
    <div>
      <HeaderDashboard />
      <StatsCards />
      <ActivityTable />
    </div>
  )
}
