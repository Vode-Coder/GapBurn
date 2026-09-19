import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CareerSimulator() {
  const { data, isLoading } = useQuery({ queryKey: ['sim'], queryFn: studentApi.simulation })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Career simulator</h1>
      <p className="text-stone-600">
        From {data.fromProfile?.degree} toward <strong>{data.targetRole}</strong>. Estimated readiness {data.estimatedReadiness}%.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {data.pathOptions?.map((path) => (
          <Card key={path.name} title={path.name}>
            <p className="font-display text-4xl text-brand-800">+{path.lift}</p>
            <p className="text-sm text-stone-500">readiness points in {path.months} months</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
