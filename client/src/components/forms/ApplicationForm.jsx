import Button from '../common/Button'

export default function ApplicationForm({ matchScore, breakdown, onApply, disabled }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="text-sm font-medium">Explainable match · {matchScore}%</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-600">
        {Object.entries(breakdown || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between rounded-lg bg-white px-2 py-1">
            <dt className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd>{value}%</dd>
          </div>
        ))}
      </dl>
      <Button className="mt-4 w-full" onClick={onApply} disabled={disabled}>
        Apply
      </Button>
    </div>
  )
}
