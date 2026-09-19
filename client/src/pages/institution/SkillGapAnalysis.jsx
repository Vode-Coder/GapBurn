import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { institutionApi } from '../../api/institutionApi'
import Badge from '../../components/common/Badge'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function gapState(gap) {
  if (gap >= 100) return { label: 'Critical shortage', tone: 'rose', color: 'bg-rose-500' }
  if (gap > 0) return { label: 'Needs action', tone: 'amber', color: 'bg-saffron-500' }
  return { label: 'Healthy supply', tone: 'teal', color: 'bg-brand-600' }
}

function recommendation(row) {
  if (row.gap >= 100) return `Launch an intensive ${row.skill} bootcamp and reserve seats for placement-focused students.`
  if (row.gap > 0) return `Add a short module, mentor clinic, or industry assignment focused on ${row.skill}.`
  return `Maintain the current ${row.skill} pipeline and use advanced projects to keep learners industry-ready.`
}

export default function SkillGapAnalysis() {
  const { data = [], isLoading } = useQuery({ queryKey: ['inst-gaps'], queryFn: institutionApi.skillGaps })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('gap')
  const [selectedSkill, setSelectedSkill] = useState('')

  if (isLoading) return <LoadingSpinner />

  const rows = data.map((row) => ({ ...row, gap: row.demand - row.students, coverage: row.demand ? Math.round((row.students / row.demand) * 100) : 0 }))
  const filteredRows = rows
    .filter((row) => row.skill.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((row) => filter === 'shortage' ? row.gap > 0 : filter === 'healthy' ? row.gap <= 0 : true)
    .sort((a, b) => sortBy === 'coverage' ? a.coverage - b.coverage : b.gap - a.gap)
  const shortageCount = rows.filter((row) => row.gap > 0).length
  const totalShortage = rows.reduce((total, row) => total + Math.max(row.gap, 0), 0)
  const averageCoverage = rows.length ? Math.round(rows.reduce((total, row) => total + Math.min(row.coverage, 100), 0) / rows.length) : 0
  const selected = rows.find((row) => row.skill === selectedSkill) || filteredRows[0]
  const maxScale = Math.max(...rows.flatMap((row) => [row.students, row.demand]), 1)

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Institution planning workspace</p>
        <h1 className="font-display text-4xl text-brand-950">Skill supply vs demand</h1>
        <p className="mt-2 max-w-3xl text-stone-600">Identify the skills where industry demand is ahead of student readiness, then turn each gap into a targeted academic action.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Skills tracked"><p className="font-display text-4xl text-brand-950">{rows.length}</p><p className="text-sm text-stone-500">Across current role templates</p></Card>
        <Card title="Shortages"><p className="font-display text-4xl text-rose-600">{shortageCount}</p><p className="text-sm text-stone-500">Skills below industry demand</p></Card>
        <Card title="Learners to close"><p className="font-display text-4xl text-saffron-700">{totalShortage}</p><p className="text-sm text-stone-500">Estimated additional learners</p></Card>
        <Card title="Average coverage"><p className="font-display text-4xl text-brand-700">{averageCoverage}%</p><p className="text-sm text-stone-500">Supply against demand</p></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card title="Gap heatmap" action={<Badge tone="slate">{filteredRows.length} shown</Badge>}>
          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input className="rounded-xl border border-stone-300 px-3 py-2.5 text-sm" placeholder="Search a skill" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="rounded-xl border border-stone-300 px-3 py-2.5 text-sm" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All skills</option><option value="shortage">Shortage only</option><option value="healthy">Healthy supply</option></select>
            <select className="rounded-xl border border-stone-300 px-3 py-2.5 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="gap">Sort by gap</option><option value="coverage">Sort by coverage</option></select>
          </div>

          <div className="space-y-3">
            {filteredRows.map((row) => {
              const state = gapState(row.gap)
              return (
                <button type="button" key={row.skill} className={`w-full rounded-2xl border p-4 text-left transition hover:border-brand-300 hover:shadow-sm ${selected?.skill === row.skill ? 'border-brand-400 bg-brand-50/60' : 'border-stone-200 bg-stone-50/60'}`} onClick={() => setSelectedSkill(row.skill)}>
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-brand-950">{row.skill}</p><p className="mt-1 text-xs text-stone-500">{row.students} students supplied · {row.demand} industry demand</p></div><div className="flex items-center gap-2"><Badge tone={state.tone}>{state.label}</Badge><span className={`font-display text-2xl ${row.gap > 0 ? 'text-rose-600' : 'text-brand-700'}`}>{row.gap > 0 ? `−${row.gap}` : `+${Math.abs(row.gap)}`}</span></div></div>
                  <div className="mt-4 space-y-2"><div className="flex items-center gap-3 text-[11px] text-stone-500"><span className="w-14">Supply</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(row.students / maxScale) * 100}%` }} /></div><span className="w-8 text-right font-medium">{row.students}</span></div><div className="flex items-center gap-3 text-[11px] text-stone-500"><span className="w-14">Demand</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200"><div className={`h-full rounded-full ${state.color}`} style={{ width: `${(row.demand / maxScale) * 100}%` }} /></div><span className="w-8 text-right font-medium">{row.demand}</span></div></div>
                </button>
              )
            })}
            {!filteredRows.length ? <p className="py-8 text-center text-sm text-stone-500">No skills match these filters.</p> : null}
          </div>
        </Card>

        <Card title="Action plan">
          {selected ? (
            <div>
              <div className="rounded-2xl bg-brand-950 p-4 text-white"><p className="text-xs uppercase tracking-[0.16em] text-brand-200">Selected priority</p><h2 className="mt-2 font-display text-2xl">{selected.skill}</h2><div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xs text-brand-200">Current coverage</p><p className="font-display text-4xl">{Math.min(selected.coverage, 100)}%</p></div><Badge tone={gapState(selected.gap).tone}>{gapState(selected.gap).label}</Badge></div></div>
              <div className="mt-4 space-y-4 text-sm"><div><p className="font-semibold text-brand-950">Recommended next step</p><p className="mt-1 leading-6 text-stone-600">{recommendation(selected)}</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">Supply</p><p className="mt-1 text-xl font-semibold text-brand-900">{selected.students}</p></div><div className="rounded-xl bg-stone-50 p-3"><p className="text-xs text-stone-500">Demand</p><p className="mt-1 text-xl font-semibold text-brand-900">{selected.demand}</p></div></div><div className="rounded-xl border border-saffron-200 bg-saffron-50 p-3 text-saffron-900"><p className="font-semibold">Placement signal</p><p className="mt-1 text-xs leading-5">Closing this gap can improve eligibility for the institution&apos;s industry roles and placement funnel.</p></div></div>
            </div>
          ) : <p className="text-sm text-stone-500">Select a skill to see its action plan.</p>}
        </Card>
      </div>
    </div>
  )
}
