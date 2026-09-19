import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useNotify } from '../../context/NotificationContext'
import { formatDate } from '../../utils/formatters'

const emptyValues = { type: 'milestone', title: '', description: '', date: new Date().toISOString().slice(0, 10) }

export default function CareerTimeline() {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const [editing, setEditing] = useState(null)
  const { data = [], isLoading } = useQuery({ queryKey: ['timeline'], queryFn: studentApi.timeline })
  const { register, handleSubmit, reset } = useForm({ defaultValues: emptyValues })

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['timeline'] })
  const save = useMutation({
    mutationFn: (values) => editing ? studentApi.updateTimeline(editing.id, values) : studentApi.addTimeline(values),
    onSuccess: () => {
      refresh()
      reset(emptyValues)
      setEditing(null)
      notify.push({ type: 'success', title: editing ? 'Timeline updated' : 'Timeline milestone added' })
    },
  })

  const startEdit = (event) => {
    if (!event.studentId || !['student-added', 'student-updated'].includes(event.source)) return
    setEditing(event)
    reset({ type: event.type || 'milestone', title: event.title, description: event.description, date: event.date?.slice(0, 10) })
  }

  const cancelEdit = () => {
    setEditing(null)
    reset(emptyValues)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-stone-500">Student growth record</p>
        <h1 className="font-display text-4xl text-brand-950">Career timeline</h1>
        <p className="mt-2 max-w-2xl text-stone-600">Keep your academic, project, internship, certification, and career milestones in one place.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card title={editing ? 'Edit your milestone' : 'Add a milestone'}>
          <form className="grid gap-3" onSubmit={handleSubmit((values) => save.mutate(values))}>
            <select className="rounded-xl border border-stone-300 px-3 py-2.5" {...register('type')}>
              <option value="milestone">Milestone</option>
              <option value="education">Education</option>
              <option value="project">Project</option>
              <option value="internship">Internship</option>
              <option value="certification">Certification</option>
              <option value="achievement">Achievement</option>
            </select>
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Milestone title" {...register('title', { required: true })} />
            <textarea className="rounded-xl border border-stone-300 px-3 py-2.5" rows={4} placeholder="Describe what you achieved or learned" {...register('description', { required: true })} />
            <label className="grid gap-1 text-sm text-stone-600">
              Date
              <input className="rounded-xl border border-stone-300 px-3 py-2.5 text-ink" type="date" {...register('date', { required: true })} />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add to timeline'}</Button>
              {editing ? <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button> : null}
            </div>
          </form>
        </Card>

        <Card title="Your milestones" action={<Badge tone="teal">{data.length} events</Badge>}>
          <ol className="space-y-6 border-l-2 border-brand-200 pl-6">
            {data.map((event) => {
              const editable = event.studentId && ['student-added', 'student-updated'].includes(event.source)
              return (
                <li key={event.id} className="relative">
                  <span className={`absolute -left-[31px] mt-1 h-4 w-4 rounded-full border-4 border-white ${editable ? 'bg-brand-600' : 'bg-saffron-500'}`} />
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-stone-400">{formatDate(event.date)} · {event.source}</p>
                      <h2 className="mt-1 font-display text-2xl text-brand-950">{event.title}</h2>
                    </div>
                    {editable ? <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => startEdit(event)}>Edit</Button> : <Badge tone="amber">Verified history</Badge>}
                  </div>
                  <p className="mt-1 text-stone-600">{event.description}</p>
                </li>
              )
            })}
          </ol>
        </Card>
      </div>
    </div>
  )
}
