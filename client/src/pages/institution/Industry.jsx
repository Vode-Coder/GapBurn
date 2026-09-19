import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { institutionApi } from '../../api/institutionApi'
import Badge from '../../components/common/Badge'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function DetailList({ items }) {
  return (
    <ul className="space-y-2 text-sm text-stone-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function InstitutionIndustry() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['institution-industry'],
    queryFn: institutionApi.industryCatalog,
  })
  const [selectedId, setSelectedId] = useState('')
  const selected = data.find((item) => item.id === selectedId) || data[0]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Institution workspace</p>
        <h1 className="font-display text-4xl text-brand-950">Industry requirements</h1>
        <p className="mt-2 max-w-3xl text-stone-600">
          Review the skills, experience, certifications, and responsibilities that industry partners expect from students.
        </p>
      </div>

      <Card title="Select industry role">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <select
            className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm"
            value={selected?.id || ''}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.companyName} · {item.roleName}
              </option>
            ))}
          </select>
          {selected ? <Badge tone="teal">{selected.industryType}</Badge> : null}
        </div>
      </Card>

      {selected ? (
        <>
          <Card>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-sm text-stone-500">{selected.companyName} · {selected.location}</p>
                <h2 className="mt-1 font-display text-3xl text-brand-950">{selected.roleName}</h2>
              </div>
              <Badge tone="amber">{selected.experience}</Badge>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Required skills">
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill) => (
                  <Badge key={skill} tone="teal">{skill}</Badge>
                ))}
              </div>
            </Card>
            <Card title="Experience">
              <p className="text-2xl font-semibold text-brand-900">{selected.experience}</p>
              <p className="mt-1 text-sm text-stone-500">Expected industry experience for this role</p>
            </Card>
            <Card title="Preferred certifications">
              <DetailList items={selected.certifications} />
            </Card>
            <Card title="Minimum requirements">
              <DetailList items={selected.minimumRequirements} />
            </Card>
          </div>

          <Card title="Responsibilities after selection">
            <DetailList items={selected.responsibilities} />
          </Card>
        </>
      ) : (
        <Card title="No industry roles available">
          <p className="text-sm text-stone-500">Industry requirement profiles will appear here when they are published.</p>
        </Card>
      )}
    </div>
  )
}