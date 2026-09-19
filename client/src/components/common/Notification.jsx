export default function Notification({ title, message }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-stone-500">{message}</p>
    </div>
  )
}
