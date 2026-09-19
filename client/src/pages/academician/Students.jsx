import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { academicianApi } from '../../api/academicianApi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfidenceBar from '../../components/skilltwin/ConfidenceBar'
import { useNotify } from '../../context/NotificationContext'

export default function Students() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      degree: 'BAMS',
      branch: 'Ayurveda',
      semester: 1,
      college: 'All India Institute of Ayurveda',
      targetRole: 'Ayurveda Clinical Research Associate',
    },
  })
  const notify = useNotify()
  const { data = [], isLoading } = useQuery({ queryKey: ['faculty-students'], queryFn: academicianApi.students })

  const addStudent = useMutation({
    mutationFn: academicianApi.createStudent,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['faculty-students'] })
      notify.push({
        type: 'success',
        title: 'Student account created',
        message: `Email: ${result.credentials.email} • Password: ${result.credentials.password}`,
      })
      reset()
    },
  })

  const removeStudent = useMutation({
    mutationFn: academicianApi.removeStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty-students'] })
      notify.push({ type: 'success', title: 'Student removed' })
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Faculty management</p>
        <h1 className="font-display text-4xl text-brand-950">Student management</h1>
      </div>

      <Card title="Add student">
        <form
          className="grid gap-3"
          onSubmit={handleSubmit((values) => addStudent.mutate(values))}
        >
          <input className="rounded-xl border px-3 py-2.5" placeholder="Full name" {...register('name', { required: true })} />
          <input className="rounded-xl border px-3 py-2.5" placeholder="Email" {...register('email')} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border px-3 py-2.5" placeholder="College" {...register('college')} />
            <input className="rounded-xl border px-3 py-2.5" placeholder="Degree / branch" {...register('degree')} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border px-3 py-2.5" type="number" placeholder="Semester" {...register('semester')} />
            <input className="rounded-xl border px-3 py-2.5" placeholder="Target role" {...register('targetRole')} />
          </div>
          <input className="rounded-xl border px-3 py-2.5" placeholder="Branch" {...register('branch')} />
          <Button type="submit" disabled={addStudent.isPending}>
            {addStudent.isPending ? 'Creating…' : 'Add student'}
          </Button>
        </form>
      </Card>

      {data.map((s) => (
        <Card
          key={s.id}
          title={s.name}
          action={
            <Button
              variant="secondary"
              className="!px-3 !py-1.5 text-xs"
              onClick={() => removeStudent.mutate(s.id)}
              disabled={removeStudent.isPending}
            >
              Remove
            </Button>
          }
        >
          <p className="text-sm text-stone-500">
            {s.degree} · Sem {s.semester} · {s.targetRole}
          </p>
          <div className="mt-3 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">
            <p><span className="font-medium">Email:</span> {s.email}</p>
            <p><span className="font-medium">Password:</span> {s.password || 'Student@123'}</p>
          </div>
          <div className="mt-4">
            <ConfidenceBar value={s.careerReadinessScore} label="Readiness" />
          </div>
        </Card>
      ))}
    </div>
  )
}
