export default function EvidenceGraph({ skills = [] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-950 p-5 text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Skill DNA</p>
      <p className="mt-1 font-display text-2xl">Evidence graph</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id || skill.name}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm"
            title={skill.verificationStatus}
          >
            {skill.name}
            <span className="ml-2 text-brand-200">{skill.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
