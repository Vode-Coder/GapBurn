import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { studentApi } from '../../api/studentApi'
import Card from '../../components/common/Card'
import SkillGapHeatmap from '../../components/charts/SkillGapHeatmap'
import Badge, { verificationTone } from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'

export default function SkillGaps() {
  const { data = [], isLoading } = useQuery({ queryKey: ['gaps'], queryFn: studentApi.skillGaps })
  if (isLoading) return <LoadingSpinner />

  const prioritized = [...data].sort((a, b) => (b.gap || 0) - (a.gap || 0))
  const openGaps = data.filter((row) => (row.gap || 0) > 0)
  const averageCoverage = data.length
    ? Math.round(data.reduce((total, row) => total + Math.min(100, (row.currentScore / Math.max(row.requiredScore, 1)) * 100), 0) / data.length)
    : 0
  const topGap = prioritized[0]

  return (
    <div className="grid gap-5">
      <div className="overflow-hidden rounded-3xl bg-brand-950 p-7 text-white shadow-lg md:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-saffron-300">Career readiness map</p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight md:text-5xl">Close the distance to your target role.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-100">Your skill gaps compare current evidence with the requirements for the Ayurveda Clinical Research Associate path.</p>
          </div>
          <Link to="/student/learning"><Button variant="saffron">Open learning path</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Skills to strengthen"><p className="font-display text-4xl text-rose-600">{openGaps.length}</p><p className="text-sm text-stone-500">Requirements below target level</p></Card>
        <Card title="Current coverage"><p className="font-display text-4xl text-brand-700">{averageCoverage}%</p><p className="text-sm text-stone-500">Average against role requirements</p></Card>
        <Card title="Top priority"><p className="font-display text-2xl text-brand-950">{topGap?.skill || 'All clear'}</p><p className="text-sm text-stone-500">Best next skill to improve</p></Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card title="Gap intensity" action={<Badge tone="rose">{openGaps.length} open gaps</Badge>}>
          <div className="space-y-4">
            <SkillGapHeatmap rows={prioritized} />
            <div className="flex flex-wrap gap-4 border-t border-stone-100 pt-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-saffron-400" /> Developing</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Priority gap</span>
            </div>
          </div>
        </Card>

        <Card title="Recommended focus">
          {topGap ? (
            <div className="rounded-2xl bg-gradient-to-br from-saffron-50 to-rose-50 p-5">
              <Badge tone="rose">Priority skill</Badge>
              <h2 className="mt-3 font-display text-2xl text-brand-950">{topGap.skill}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Move from {topGap.currentLevel} toward {topGap.requiredLevel} by adding verified practice and a project artifact.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-white/80 p-3"><p className="text-xs text-stone-500">Current score</p><p className="mt-1 text-xl font-semibold text-brand-900">{topGap.currentScore}</p></div><div className="rounded-xl bg-white/80 p-3"><p className="text-xs text-stone-500">Target score</p><p className="mt-1 text-xl font-semibold text-brand-900">{topGap.requiredScore}</p></div></div>
            </div>
          ) : <p className="text-sm text-stone-500">Your current skills meet the tracked requirements.</p>}
        </Card>
      </div>

      <Card title="Requirement details" action={<Badge tone="slate">Evidence health</Badge>}>
        <Table
          rows={prioritized}
          rowKey="skill"
          columns={[
            { key: 'skill', header: 'Skill', render: (row) => <span className="font-medium text-brand-900">{row.skill}</span> },
            { key: 'currentLevel', header: 'Current level' },
            { key: 'requiredLevel', header: 'Target level' },
            { key: 'gap', header: 'Gap', render: (row) => <span className={`font-semibold ${row.gap > 0 ? 'text-rose-600' : 'text-brand-700'}`}>{row.gap > 0 ? `-${row.gap}` : 'Ready'}</span> },
            { key: 'verificationStatus', header: 'Evidence', render: (row) => <Badge tone={verificationTone(row.verificationStatus)}>{row.verificationStatus}</Badge> },
          ]}
        />
      </Card>
    </div>
  )
}
