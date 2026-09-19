export default function ConfidenceBar({ value, label }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-stone-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full bg-brand-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
