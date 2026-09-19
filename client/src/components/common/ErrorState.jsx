export default function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-800">
      {message}
    </div>
  )
}
