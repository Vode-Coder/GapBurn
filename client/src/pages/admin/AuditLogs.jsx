import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/formatters'

export default function AuditLogs() {
  const { data = [], isLoading } = useQuery({ queryKey: ['audit'], queryFn: adminApi.audit })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-5 font-display text-4xl text-brand-950">Audit logs</h1>
      <Card>
        <Table
          rows={data}
          columns={[
            { key: 'action', header: 'Action' },
            { key: 'actorRole', header: 'Actor role' },
            { key: 'entityType', header: 'Entity' },
            { key: 'createdAt', header: 'When', render: (r) => formatDate(r.createdAt) },
          ]}
        />
      </Card>
    </div>
  )
}
