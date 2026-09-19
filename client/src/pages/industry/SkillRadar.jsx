import { useQuery } from '@tanstack/react-query'
import { industryApi } from '../../api/industryApi'
import Card from '../../components/common/Card'
import SkillRadarChart from '../../components/charts/SkillRadarChart'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function SkillRadar() {
  const { data = [], isLoading } = useQuery({ queryKey: ['radar'], queryFn: industryApi.skillRadar })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-5 font-display text-4xl text-brand-950">Skill radar</h1>
      <Card title="Aarav Mehta vs CRA template">
        <SkillRadarChart data={data} />
      </Card>
    </div>
  )
}
