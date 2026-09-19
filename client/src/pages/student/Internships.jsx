import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { internshipApi } from '../../api/internshipApi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import ApplicationForm from '../../components/forms/ApplicationForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useNotify } from '../../context/NotificationContext'

export default function Internships() {
  const { data = [], isLoading } = useQuery({ queryKey: ['internships'], queryFn: internshipApi.list })
  const qc = useQueryClient()
  const notify = useNotify()
  const apply = useMutation({
    mutationFn: internshipApi.apply,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] })
      notify.push({ type: 'success', title: 'Application sent' })
    },
    onError: (err) => notify.push({ type: 'error', title: err.response?.data?.message || err.message }),
  })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Internships</h1>
      {data.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          action={<Badge tone="amber">{item.matchScore}% match</Badge>}
        >
          <p className="text-sm text-stone-500">
            {item.companyName} · {item.location} · {item.type} · ₹{item.stipend}/mo
          </p>
          <p className="mt-2 text-sm text-stone-600">{item.description}</p>
          <div className="mt-4">
            <ApplicationForm
              matchScore={item.matchScore}
              breakdown={item.matchBreakdown}
              onApply={() => apply.mutate(item.id)}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
