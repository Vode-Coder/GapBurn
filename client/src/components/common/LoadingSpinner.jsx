export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-brand-800">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
