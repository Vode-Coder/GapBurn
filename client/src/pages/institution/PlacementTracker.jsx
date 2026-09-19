import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { institutionApi } from '../../api/institutionApi'
import Badge from '../../components/common/Badge'
import Card from '../../components/common/Card'
import PlacementProgressChart from '../../components/charts/PlacementProgressChart'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Table from '../../components/common/Table'
import { formatDate } from '../../utils/formatters'

export default function PlacementTracker() {
  const { data = {}, isLoading } = useQuery({ queryKey: ['placements'], queryFn: institutionApi.placements })
  const [search, setSearch] = useState('')
  if (isLoading) return <LoadingSpinner />

  const records = data.records || []
  const normalizedSearch = search.trim().toLowerCase()
  const filteredRecords = records.filter((record) =>
    [record.studentName, record.companyName, record.role, record.programme]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch),
  )

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Institution outcomes</p>
        <h1 className="font-display text-4xl text-brand-950">Placement tracker</h1>
        <p className="mt-2 text-stone-600">Track who received an offer, where they are joining, and the outcome of each placement.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Students placed">
          <p className="font-display text-4xl text-brand-950">{data.summary?.totalPlaced ?? 0}</p>
          <p className="text-sm text-stone-500">Accepted offers and joined roles</p>
        </Card>
        <Card title="Average package">
          <p className="font-display text-3xl text-brand-950">{data.summary?.averagePackage ?? '—'}</p>
          <p className="text-sm text-stone-500">Across salary-based offers</p>
        </Card>
        <Card title="Highest package">
          <p className="font-display text-3xl text-brand-950">{data.summary?.highestPackage ?? '—'}</p>
          <p className="text-sm text-stone-500">Best reported annual offer</p>
        </Card>
        <Card title="Recruiters">
          <p className="font-display text-4xl text-brand-950">{data.summary?.recruiterCount ?? 0}</p>
          <p className="text-sm text-stone-500">Companies with recorded outcomes</p>
        </Card>
      </div>

      <Card title="Placement funnel">
        <PlacementProgressChart data={data.funnel || []} />
      </Card>

      <Card
        title="Placed students"
        action={
          <input
            className="w-44 rounded-xl border border-stone-300 px-3 py-2 text-sm"
            placeholder="Search students or roles"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      >
        <Table
          rows={filteredRecords}
          columns={[
            {
              key: 'studentName',
              header: 'Student',
              render: (record) => (
                <div>
                  <p className="font-medium text-brand-900">{record.studentName}</p>
                  <p className="text-xs text-stone-500">{record.programme} · {record.department}</p>
                </div>
              ),
            },
            {
              key: 'companyName',
              header: 'Company / role',
              render: (record) => (
                <div>
                  <p className="font-medium">{record.companyName}</p>
                  <p className="text-xs text-stone-500">{record.role}</p>
                </div>
              ),
            },
            {
              key: 'placedAt',
              header: 'Placed on',
              render: (record) => formatDate(record.placedAt),
            },
            {
              key: 'package',
              header: 'Offer received',
              render: (record) => (
                <div>
                  <p className="font-medium text-brand-900">{record.package}</p>
                  <p className="text-xs text-stone-500">{record.offerType}</p>
                </div>
              ),
            },
            {
              key: 'joiningDate',
              header: 'Joining / location',
              render: (record) => (
                <div>
                  <p>{formatDate(record.joiningDate)}</p>
                  <p className="text-xs text-stone-500">{record.location}</p>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (record) => <Badge tone={record.status === 'Joined' ? 'teal' : 'amber'}>{record.status}</Badge>,
            },
          ]}
        />
        {!filteredRecords.length ? <p className="py-5 text-center text-sm text-stone-500">No placement records match your search.</p> : null}
      </Card>
    </div>
  )
}
