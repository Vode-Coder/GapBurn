import { useQuery } from '@tanstack/react-query'
import { academicianApi } from '../../api/academicianApi'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function FacultyDashboard() {
  const students = useQuery({ queryKey: ['faculty-students'], queryFn: academicianApi.students })
  const queue = useQuery({ queryKey: ['verifications'], queryFn: academicianApi.verifications })
  const mentorship = useQuery({ queryKey: ['mentorship'], queryFn: academicianApi.mentorship })

  if (students.isLoading) return <LoadingSpinner />

  const pending = (queue.data || []).filter((v) => v.status === 'pending').length
  const verified = (queue.data || []).filter((v) => v.status === 'approved').length
  const activeMentorship = (mentorship.data || []).filter((item) => item.status === 'active').length

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Faculty desk</p>
        <h1 className="font-display text-4xl text-brand-950">Academic mentorship overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Assigned students">
          <p className="font-display text-4xl">{students.data?.length ?? 0}</p>
        </Card>
        <Card title="Pending reviews">
          <p className="font-display text-4xl">{pending}</p>
        </Card>
        <Card title="Approved this cycle">
          <p className="font-display text-4xl">{verified}</p>
        </Card>
        <Card title="Active mentorships">
          <p className="font-display text-4xl">{activeMentorship}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="At-a-glance student health">
          <ul className="space-y-3 text-sm">
            {(students.data || []).slice(0, 4).map((student) => (
              <li key={student.id} className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-stone-500">{student.degree || 'BAMS'} · {student.college || 'AIIA'}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-800">
                  {student.skillTwinScore ?? student.careerReadinessScore ?? 72}%
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Review queue">
          <ul className="space-y-3 text-sm">
            {(queue.data || []).slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.studentName}</p>
                  <p className="text-stone-500">{item.entityTitle}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-saffron-700">{item.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
