import { useMutation, useQuery } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useNotify } from '../../context/NotificationContext'
import { useState } from 'react'

export default function Assessment() {
  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: studentApi.assessments,
  })
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: studentApi.assignments,
  })
  const notify = useNotify()
  const [last, setLast] = useState(null)
  const attempt = useMutation({
    mutationFn: studentApi.attemptAssessment,
    onSuccess: (result) => {
      setLast(result)
      notify.push({ type: 'success', title: `Score ${result.score}` })
    },
  })
  if (assessmentsLoading || assignmentsLoading) return <LoadingSpinner />

  const allTasks = [
    ...assessments.map((item) => ({ ...item, type: 'assessment' })),
    ...assignments.map((item) => ({ ...item, type: 'assignment' })),
  ]

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Assessments</h1>
      {allTasks.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          action={
            <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-brand-800">
              {item.type === 'assignment' ? 'Industry assignment' : item.difficulty}
            </span>
          }
        >
          <p className="text-sm text-stone-600">
            {item.type === 'assignment'
              ? `${item.duration} • ${item.requiredSkills?.join(', ') || 'Skill-based task'}`
              : `${item.questions} questions • ${item.category}`}
          </p>
          {item.type === 'assignment' ? (
            <p className="mt-2 text-sm text-stone-500">
              {item.description}
            </p>
          ) : null}
          <Button className="mt-4" onClick={() => attempt.mutate(item.id)}>
            {item.type === 'assignment' ? 'Start assignment' : 'Take demo attempt'}
          </Button>
        </Card>
      ))}
      {last ? (
        <Card title="Latest result">
          <p className="font-display text-4xl">{last.score}</p>
          <p className="text-sm text-stone-500">Strengths: {last.strengths?.join(', ')}</p>
        </Card>
      ) : null}
    </div>
  )
}
