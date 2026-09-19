import { useQuery } from '@tanstack/react-query'
import { academicianApi } from '../../api/academicianApi'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Mentorship() {
  const { data = [], isLoading } = useQuery({ queryKey: ['mentorship'], queryFn: academicianApi.mentorship })
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Mentorship</h1>
      {data.map((m) => (
        <Card key={m.id} title={m.menteeName}>
          <p className="text-sm text-stone-500">Status: {m.status}</p>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {m.goals?.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  )
}
