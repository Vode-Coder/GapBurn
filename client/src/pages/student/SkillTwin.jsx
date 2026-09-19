import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSkillTwin } from '../../hooks/useSkillTwin'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SkillCard from '../../components/skilltwin/SkillCard'
import EvidenceGraph from '../../components/skilltwin/EvidenceGraph'
import SkillForm from '../../components/forms/SkillForm'
import { studentApi } from '../../api/studentApi'
import { useNotify } from '../../context/NotificationContext'

export default function SkillTwin() {
  const { data, isLoading } = useSkillTwin()
  const qc = useQueryClient()
  const notify = useNotify()
  const add = useMutation({
    mutationFn: studentApi.addSkill,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skill-twin'] })
      notify.push({ type: 'success', title: 'Skill added as self-reported' })
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Career Digital Twin</h1>
      <EvidenceGraph skills={data?.skills} />
      <Card title="Add a skill manually">
        <SkillForm onSubmit={(values) => add.mutate(values)} />
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.skills?.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  )
}
