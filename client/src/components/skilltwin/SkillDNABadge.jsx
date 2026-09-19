export default function SkillDNABadge({ score }) {
  return (
    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-saffron-500 bg-brand-950 text-white">
      <span className="text-xs uppercase tracking-wide text-brand-200">Twin</span>
      <span className="font-display text-3xl">{score}</span>
    </div>
  )
}
