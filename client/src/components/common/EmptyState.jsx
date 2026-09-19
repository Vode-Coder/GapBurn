export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{message}</p>
    </div>
  )
}
