export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const styles = {
    primary:
      'bg-brand-700 text-white hover:bg-brand-800 shadow-sm',
    saffron:
      'bg-saffron-600 text-white hover:bg-saffron-700 shadow-sm',
    ghost:
      'bg-transparent text-brand-800 hover:bg-brand-50 border border-brand-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'bg-white text-ink border border-stone-300 hover:bg-stone-50',
  }
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
