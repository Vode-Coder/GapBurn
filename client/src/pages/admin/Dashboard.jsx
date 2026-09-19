import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/adminApi'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const users = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.users })
  const audit = useQuery({ queryKey: ['audit'], queryFn: adminApi.audit })
  if (users.isLoading) return <LoadingSpinner />

  const roleCounts = (users.data || []).reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  const latestLogs = (audit.data || []).slice(0, 4)

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Platform control</p>
        <h1 className="font-display text-4xl text-brand-950">System overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Users">
          <p className="font-display text-4xl">{users.data?.length ?? 0}</p>
        </Card>
        <Card title="Audit events">
          <p className="font-display text-4xl">{audit.data?.length ?? 0}</p>
        </Card>
        <Card title="Active roles">
          <p className="font-display text-4xl">{Object.keys(roleCounts).length}</p>
        </Card>
        <Card title="System health">
          <p className="font-display text-4xl">98%</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Role distribution">
          <div className="space-y-3 text-sm">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2">
                <span className="font-medium text-brand-900">{role}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent activity">
          <ul className="space-y-3 text-sm">
            {latestLogs.map((log) => (
              <li key={log.id} className="border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <p className="font-medium">{log.action}</p>
                <p className="text-stone-500">{log.entityType} · {log.actorRole}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
