import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { jobApi } from '../../api/jobApi'
import Button from '../../components/common/Button'
import { useNotify } from '../../context/NotificationContext'

export default function CreateJob() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { requiredSkills: 'GCP / Clinical Trials, Pharmacovigilance' },
  })
  const notify = useNotify()
  const create = useMutation({
    mutationFn: jobApi.create,
    onSuccess: () => {
      notify.push({ type: 'success', title: 'Job published' })
      reset()
    },
  })

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl text-brand-950">New job</h1>
      <form
        className="mt-6 grid gap-3"
        onSubmit={handleSubmit((values) =>
          create.mutate({
            ...values,
            requiredSkills: values.requiredSkills.split(',').map((s) => s.trim()),
          }),
        )}
      >
        <input className="rounded-xl border px-3 py-2.5" placeholder="Title" {...register('title', { required: true })} />
        <textarea className="rounded-xl border px-3 py-2.5" rows={4} placeholder="Description" {...register('description')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Location" {...register('location')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Salary" {...register('salary')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Experience" {...register('experience')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Skills, comma separated" {...register('requiredSkills')} />
        <Button type="submit">Publish</Button>
      </form>
    </div>
  )
}
