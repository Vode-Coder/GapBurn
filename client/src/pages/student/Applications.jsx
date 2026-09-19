import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/formatters'

export default function Applications() {
  const { data = [], isLoading } = useQuery({ queryKey: ['applications'], queryFn: studentApi.applications })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-5 font-display text-4xl text-brand-950">Applications</h1>
      <Card>
        <Table
          rows={data}
          columns={[
            { key: 'title', header: 'Role' },
            { key: 'companyName', header: 'Org' },
            { key: 'opportunityType', header: 'Type' },
            { key: 'matchScore', header: 'Match', render: (row) => `${row.matchScore}%` },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <Badge>{row.status}</Badge>,
            },
            { key: 'appliedAt', header: 'Applied', render: (row) => formatDate(row.appliedAt) },
          ]}
        />
      </Card>
    </div>
  )
}
