export default function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-brand-950">{title}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-ink">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
