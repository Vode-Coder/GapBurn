import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { industryApi } from '../../api/industryApi'
import Table from '../../components/common/Table'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Applicants() {
  const { data = [], isLoading } = useQuery({ queryKey: ['applicants'], queryFn: industryApi.applicants })
  const qc = useQueryClient()
  const update = useMutation({
    mutationFn: ({ id, status }) => industryApi.updateApplicationStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants'] }),
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-5 font-display text-4xl text-brand-950">Candidate pipeline</h1>
      <Card>
        <Table
          rows={data}
          columns={[
            { key: 'applicantName', header: 'Candidate' },
            { key: 'title', header: 'Role' },
            { key: 'matchScore', header: 'Match', render: (r) => `${r.matchScore}%` },
            { key: 'status', header: 'Status' },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <Button
                  variant="ghost"
                  className="!py-1 text-xs"
                  onClick={() => update.mutate({ id: row.id, status: 'Interview' })}
                >
                  Move to interview
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
