import { useQuery } from '@tanstack/react-query'
import { industryApi } from '../../api/industryApi'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function IndustryDashboard() {
  const profile = useQuery({ queryKey: ['industry-profile'], queryFn: industryApi.profile })
  const applicants = useQuery({ queryKey: ['applicants'], queryFn: industryApi.applicants })
  const skillProfile = useQuery({ queryKey: ['skill-profile'], queryFn: industryApi.skillProfile })

  if (profile.isLoading || skillProfile.isLoading) return <LoadingSpinner />

  const applicationBreakdown = {
    shortlisted: (applicants.data || []).filter((app) => app.status === 'Shortlisted').length,
    applied: (applicants.data || []).filter((app) => app.status === 'Applied').length,
    selected: (applicants.data || []).filter((app) => app.status === 'Selected').length,
  }

  const prioritySkills = (skillProfile.data?.requiredSkills || []).slice(0, 4)

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Industry workspace</p>
        <h1 className="font-display text-4xl text-brand-950">{profile.data?.companyName}</h1>
        <p className="mt-2 text-stone-600">{profile.data?.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Pipeline">
          <p className="font-display text-4xl">{applicants.data?.length ?? 0}</p>
          <p className="text-sm text-stone-500">Active applications</p>
        </Card>
        <Card title="Shortlisted">
          <p className="font-display text-4xl">{applicationBreakdown.shortlisted}</p>
          <p className="text-sm text-stone-500">Qualified for next stage</p>
        </Card>
        <Card title="Location">
          <p className="text-lg">{profile.data?.location}</p>
        </Card>
        <Card title="Sector">
          <p className="text-lg">{profile.data?.industryType}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Hiring priorities">
          <div className="space-y-3">
            {prioritySkills.map((item) => (
              <div key={item.name} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-brand-900">{item.name}</p>
                  <span className="text-xs uppercase tracking-wide text-saffron-700">{item.priority}</span>
                </div>
                <p className="mt-1 text-sm text-stone-600">Target level: {item.level}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent applicants">
          <ul className="space-y-3 text-sm">
            {(applicants.data || []).slice(0, 4).map((app) => (
              <li key={app.id} className="border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{app.applicantName}</span>
                  <span className="text-stone-500">{app.matchScore ?? 0}%</span>
                </div>
                <p className="text-stone-500">{app.college} · {app.status}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
