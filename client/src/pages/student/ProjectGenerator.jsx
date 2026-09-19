import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useNotify } from '../../context/NotificationContext'

export default function ProjectGenerator() {
  const { data = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: studentApi.projects })
  const qc = useQueryClient()
  const notify = useNotify()
  const generate = useMutation({
    mutationFn: () => studentApi.generateProject({}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notify.push({ type: 'success', title: 'Industry project drafted' })
    },
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl text-brand-950">Industry projects</h1>
        <Button variant="saffron" onClick={() => generate.mutate()}>
          Generate AI project
        </Button>
      </div>
      {data.map((project) => (
        <Card
          key={project.id}
          title={project.title}
          action={<Badge tone={project.status === 'verified' ? 'teal' : 'amber'}>{project.status}</Badge>}
        >
          <p className="text-sm text-stone-600">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.skills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
            {project.isAIGenerated ? <Badge tone="violet">AI generated</Badge> : null}
          </div>
        </Card>
      ))}
    </div>
  )
}
