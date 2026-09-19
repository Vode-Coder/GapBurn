import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/formatters'

const tone = { pending: 'slate', 'in-progress': 'amber', completed: 'teal' }

export default function LearningPath() {
  const { data, isLoading } = useQuery({ queryKey: ['learning'], queryFn: studentApi.learningPath })
  const qc = useQueryClient()
  const regen = useMutation({
    mutationFn: studentApi.generateLearningPath,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learning'] }),
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-brand-950">Learning path</h1>
          <p className="text-stone-600">
            Generated {formatDate(data.generatedAt)} for {data.targetRole}
          </p>
        </div>
        <Button onClick={() => regen.mutate()} disabled={regen.isPending}>
          Regenerate with demo AI
        </Button>
      </div>
      {data.items?.map((item, index) => (
        <Card key={item.id} title={`${index + 1}. ${item.title}`} action={<Badge tone={tone[item.status]}>{item.status}</Badge>}>
          <p className="text-sm text-stone-600">{item.reason}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-stone-400">
            {item.type} · targets {item.skillTargeted}
          </p>
        </Card>
      ))}
    </div>
  )
}
