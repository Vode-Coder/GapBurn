import { useQuery } from '@tanstack/react-query'
import { industryApi } from '../../api/industryApi'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'

export default function SkillProfile() {
  const { data, isLoading } = useQuery({ queryKey: ['skill-profile'], queryFn: industryApi.skillProfile })
  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-2 font-display text-4xl text-brand-950">{data.roleName}</h1>
      <p className="mb-5 text-stone-500">Industry skill profile used for matching</p>
      <Card>
        <Table
          rows={data.requiredSkills}
          rowKey="skillId"
          columns={[
            { key: 'name', header: 'Skill' },
            { key: 'level', header: 'Level' },
            {
              key: 'priority',
              header: 'Priority',
              render: (row) => <Badge tone={row.priority === 'high' ? 'rose' : 'teal'}>{row.priority}</Badge>,
            },
          ]}
        />
      </Card>
    </div>
  )
}
