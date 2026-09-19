import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { internshipApi } from '../../api/internshipApi'
import Button from '../../components/common/Button'
import { useNotify } from '../../context/NotificationContext'

export default function CreateInternship() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { type: 'hybrid', openings: 3, requiredSkills: 'GCP / Clinical Trials, Clinical Documentation' },
  })
  const notify = useNotify()
  const create = useMutation({
    mutationFn: internshipApi.create,
    onSuccess: () => {
      notify.push({ type: 'success', title: 'Internship published' })
      reset()
    },
  })

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl text-brand-950">New internship</h1>
      <form
        className="mt-6 grid gap-3"
        onSubmit={handleSubmit((values) =>
          create.mutate({
            ...values,
            requiredSkills: values.requiredSkills.split(',').map((s) => s.trim()),
            stipend: Number(values.stipend),
          }),
        )}
      >
        <input className="rounded-xl border px-3 py-2.5" placeholder="Title" {...register('title', { required: true })} />
        <textarea className="rounded-xl border px-3 py-2.5" rows={4} placeholder="Description" {...register('description')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Location" {...register('location')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Duration" {...register('duration')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Stipend" {...register('stipend')} />
        <input className="rounded-xl border px-3 py-2.5" placeholder="Skills, comma separated" {...register('requiredSkills')} />
        <Button type="submit">Publish</Button>
      </form>
    </div>
  )
}
