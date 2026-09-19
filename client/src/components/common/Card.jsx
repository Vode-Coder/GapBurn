export default function Card({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          {title ? <h2 className="font-display text-lg text-brand-950">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
