export default function SkillGapHeatmap({ rows }) {
  return (
    <div className="grid gap-2">
      {rows.map((row) => {
        const intensity = Math.min(100, row.gap ?? 0)
        return (
          <div key={row.skill} className="grid grid-cols-[1fr_120px] items-center gap-3">
            <p className="text-sm">{row.skill}</p>
            <div className="h-3 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-rose-500"
                style={{ width: `${intensity}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
