import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Users() {
  const { data = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.users })
  const qc = useQueryClient()
  const toggle = useMutation({
    mutationFn: adminApi.toggleUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-5 font-display text-4xl text-brand-950">Users</h1>
      <Card>
        <Table
          rows={data}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            {
              key: 'isActive',
              header: 'Status',
              render: (row) => <Badge tone={row.isActive ? 'teal' : 'rose'}>{row.isActive ? 'Active' : 'Disabled'}</Badge>,
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <Button variant="ghost" className="!py-1 text-xs" onClick={() => toggle.mutate(row.id)}>
                  Toggle
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
