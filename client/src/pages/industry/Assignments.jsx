import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { industryApi } from '../../api/industryApi'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useNotify } from '../../context/NotificationContext'

export default function Assignments() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      requiredSkills: 'Pharmacovigilance, Clinical Documentation',
      difficulty: 'Intermediate',
      duration: '35 mins',
      deadline: '',
    },
  })

  const { data = [], isLoading } = useQuery({
    queryKey: ['industry-assignments'],
    queryFn: industryApi.assignments,
  })

  const notify = useNotify()
  const create = useMutation({
    mutationFn: industryApi.createAssignment,
    onSuccess: () => {
      notify.push({ type: 'success', title: 'Assignment added' })
      reset()
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-stone-500">Industry workspace</p>
        <h1 className="font-display text-4xl text-brand-950">Assignment section</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card title="Create assignment">
          <form
            className="mt-2 grid gap-3"
            onSubmit={handleSubmit((values) =>
              create.mutate({
                ...values,
                requiredSkills: values.requiredSkills
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              }),
            )}
          >
            <input className="rounded-xl border px-3 py-2.5" placeholder="Assignment title" {...register('title', { required: true })} />
            <textarea className="rounded-xl border px-3 py-2.5" rows={4} placeholder="Describe the task" {...register('description', { required: true })} />
            <input className="rounded-xl border px-3 py-2.5" placeholder="Skills needed, comma separated" {...register('requiredSkills', { required: true })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="rounded-xl border px-3 py-2.5" {...register('difficulty')}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input className="rounded-xl border px-3 py-2.5" placeholder="Duration" {...register('duration')} />
            </div>
            <input className="rounded-xl border px-3 py-2.5" type="date" {...register('deadline')} />
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Publishing…' : 'Add assignment'}
            </Button>
          </form>
        </Card>

        <Card title="Published assignments">
          <div className="space-y-3">
            {(data || []).map((assignment) => (
              <div key={assignment.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-900">{assignment.title}</p>
                    <p className="mt-1 text-sm text-stone-600">{assignment.description}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] uppercase tracking-wide text-brand-800">
                    {assignment.difficulty}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
                  <span className="rounded-full bg-white px-2 py-1">{assignment.duration}</span>
                  <span className="rounded-full bg-white px-2 py-1">{assignment.requiredSkills?.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
