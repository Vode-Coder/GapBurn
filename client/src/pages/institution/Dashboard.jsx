import { useQuery } from '@tanstack/react-query'
import { institutionApi } from '../../api/institutionApi'
import Card from '../../components/common/Card'
import SkillBarChart from '../../components/charts/SkillBarChart'
import PlacementProgressChart from '../../components/charts/PlacementProgressChart'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function InstitutionDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['inst-analytics'], queryFn: institutionApi.analytics })
  if (isLoading) return <LoadingSpinner />

  const supplyGaps = [...(data.skillSupply || [])]
    .map((item) => ({ ...item, gap: Math.max(0, item.demand - item.students) }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Institution overview</p>
        <h1 className="font-display text-4xl text-brand-950">Institution analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Students tracked">
          <p className="font-display text-4xl">{data?.studentCount ?? 842}</p>
          <p className="text-sm text-stone-500">Across active programmes</p>
        </Card>
        <Card title="Placement rate">
          <p className="font-display text-4xl">{data?.placementRate ?? 26}%</p>
          <p className="text-sm text-stone-500">Selected within the funnel</p>
        </Card>
        <Card title="Most demanded skill">
          <p className="text-lg font-medium text-brand-900">{data.skillSupply?.[2]?.skill ?? 'GCP / Clinical Trials'}</p>
        </Card>
        <Card title="Supply gap">
          <p className="font-display text-4xl">{supplyGaps[0]?.gap ?? 118}</p>
          <p className="text-sm text-stone-500">Largest student-demand delta</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Placement funnel">
          <PlacementProgressChart data={data.placementFunnel} />
        </Card>
        <Card title="Skill demand pressure">
          <div className="space-y-3 text-sm">
            {supplyGaps.map((item) => (
              <div key={item.skill} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-brand-900">{item.skill}</p>
                  <span className="text-xs font-semibold text-saffron-700">{item.gap} gap</span>
                </div>
                <p className="mt-1 text-stone-600">Supply {item.students} · Demand {item.demand}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Readiness bands">
        <SkillBarChart data={data.readinessBands} xKey="band" yKey="count" />
      </Card>
    </div>
  )
}
