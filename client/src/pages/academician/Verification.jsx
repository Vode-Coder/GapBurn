import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { academicianApi } from '../../api/academicianApi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Verification() {
  const { data = [], isLoading } = useQuery({ queryKey: ['verifications'], queryFn: academicianApi.verifications })
  const qc = useQueryClient()
  const decide = useMutation({
    mutationFn: ({ id, status }) => academicianApi.decide(id, { status, comment: 'Reviewed in demo' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Verification queue</h1>
      {data.map((item) => (
        <Card key={item.id} title={item.entityTitle} action={<Badge>{item.status}</Badge>}>
          <p className="text-sm text-stone-500">
            {item.studentName} · {item.entityType}
          </p>
          {item.status === 'pending' ? (
            <div className="mt-4 flex gap-2">
              <Button onClick={() => decide.mutate({ id: item.id, status: 'approved' })}>Approve</Button>
              <Button variant="danger" onClick={() => decide.mutate({ id: item.id, status: 'rejected' })}>
                Reject
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-500">{item.comment}</p>
          )}
        </Card>
      ))}
    </div>
  )
}
