import { useQuery } from '@tanstack/react-query'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { useSkillTwin } from '../../hooks/useSkillTwin'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfidenceBar from '../../components/skilltwin/ConfidenceBar'
import SkillDNABadge from '../../components/skilltwin/SkillDNABadge'
import { studentApi } from '../../api/studentApi'
import { internshipApi } from '../../api/internshipApi'
import { notificationApi } from '../../api/authApi'
import { formatRelative } from '../../utils/formatters'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const profile = useStudentProfile()
  const twin = useSkillTwin()
  const apps = useQuery({ queryKey: ['applications'], queryFn: studentApi.applications })
  const internships = useQuery({ queryKey: ['internships'], queryFn: internshipApi.list })
  const notes = useQuery({ queryKey: ['notifications'], queryFn: notificationApi.list })

  if (profile.isLoading || twin.isLoading) return <LoadingSpinner />

  const gapItems = [...(twin.data?.gaps || [])]
    .filter((gap) => gap.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)

  const verifiedCount = twin.data?.dna?.filter((skill) =>
    ['Faculty Verified', 'Industry Verified'].includes(skill.verificationStatus),
  ).length

  const readiness = profile.data?.careerReadinessScore || 0
  const skillTwinScore = twin.data?.scores?.skillTwinScore || 0
  const applicationCount = apps.data?.length || 0
  const activeInternships = internships.data?.length || 0
  const nextActions = [
    'Strengthen GCP / Clinical Trials with a short practice module',
    'Add more verified evidence for research methodology',
    'Apply to at least 2 more internship matches this week',
  ]

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">Student workspace</p>
          <h1 className="font-display text-4xl text-brand-950">Namaste, {profile.data?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-stone-600">
            {profile.data?.degree} · {profile.data?.college} · Target: {profile.data?.targetRole}
          </p>
        </div>
        <SkillDNABadge score={skillTwinScore} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Career readiness">
          <ConfidenceBar value={readiness} label="Ready for CRA roles" />
        </Card>
        <Card title="Profile completeness">
          <ConfidenceBar value={profile.data?.profileCompleteness} label="Evidence coverage" />
        </Card>
        <Card title="Skill twin">
          <p className="font-display text-4xl">{skillTwinScore}%</p>
          <p className="text-sm text-stone-500">Verified strengths across your evidence map</p>
        </Card>
        <Card title="Open matches">
          <p className="font-display text-4xl">{activeInternships}</p>
          <p className="text-sm text-stone-500">Internships scored against your twin</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Priority gaps" action={<Link className="text-sm text-brand-700" to="/student/gaps">Review</Link>}>
          <div className="space-y-3">
            {gapItems.length ? (
              gapItems.map((gap) => (
                <div key={gap.skill} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-brand-900">{gap.skill}</p>
                    <span className="text-xs font-semibold text-saffron-700">{gap.gap}% gap</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    Current {gap.currentLevel || 'None'} · Target {gap.requiredLevel}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-600">You are aligned with your target role across the main skill areas.</p>
            )}
          </div>
        </Card>

        <Card title="Quick wins">
          <ul className="space-y-3 text-sm text-stone-700">
            {nextActions.map((action) => (
              <li key={action} className="flex gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Applications" action={<Link className="text-sm text-brand-700" to="/student/applications">View all</Link>}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-xl bg-brand-50 px-3 py-2 text-brand-900">
              <span>Submitted</span>
              <span className="font-semibold">{applicationCount}</span>
            </div>
            {(apps.data || []).slice(0, 3).map((app) => (
              <div key={app.id} className="flex justify-between gap-3 border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <span>{app.title}</span>
                <span className="text-stone-500">{app.status} · {app.matchScore}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Signals">
          <ul className="space-y-3 text-sm">
            {(notes.data || []).slice(0, 4).map((n) => (
              <li key={n.id}>
                <p className="font-medium">{n.title}</p>
                <p className="text-stone-500">{n.message} · {formatRelative(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Evidence health">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Verified skills</p>
            <p className="mt-2 font-display text-3xl text-brand-900">{verifiedCount || 0}</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Documents reviewed</p>
            <p className="mt-2 font-display text-3xl text-brand-900">{profile.data?.documents?.length || 1}</p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">Target progress</p>
            <p className="mt-2 font-display text-3xl text-brand-900">{Math.min(100, Math.round((verifiedCount / Math.max(twin.data?.dna?.length || 1, 1)) * 100))}%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
