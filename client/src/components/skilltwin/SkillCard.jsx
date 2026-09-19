import Badge, { verificationTone } from '../common/Badge'

export default function SkillCard({ skill }) {
  return (
    <div className="rounded-xl border border-stone-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{skill.name}</p>
          <p className="text-xs text-stone-500">{skill.category} · {skill.level}</p>
        </div>
        <Badge tone={verificationTone(skill.verificationStatus)}>{skill.verificationStatus}</Badge>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-stone-500">
          <span>Confidence</span>
          <span>{skill.confidence}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full bg-brand-600" style={{ width: `${skill.confidence}%` }} />
        </div>
      </div>
    </div>
  )
}
