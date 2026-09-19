const tones = {
  teal: 'bg-brand-50 text-brand-800 border-brand-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  rose: 'bg-rose-50 text-rose-800 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  violet: 'bg-violet-50 text-violet-800 border-violet-200',
}

export default function Badge({ children, tone = 'teal' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.teal}`}>
      {children}
    </span>
  )
}

export function verificationTone(status) {
  if (status === 'Industry Verified') return 'violet'
  if (status === 'Faculty Verified') return 'teal'
  if (status === 'AI Extracted') return 'amber'
  if (status === 'Missing') return 'rose'
  return 'slate'
}
