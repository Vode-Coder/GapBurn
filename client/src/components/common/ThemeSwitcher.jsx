import { Palette } from 'lucide-react'
import { useState } from 'react'
import { themes, useTheme } from '../../context/ThemeContext'

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const active = themes.find((item) => item.id === theme) || themes[0]

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Change theme"
        aria-expanded={open}
        title="Change theme"
        className="rounded-full bg-white p-2 text-brand-800 hover:bg-brand-50"
        onClick={() => setOpen((current) => !current)}
      >
        <Palette size={18} />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
          <div className="px-3 py-2"><p className="text-sm font-semibold text-brand-950">Theme mode</p><p className="text-xs text-stone-500">Choose your workspace look</p></div>
          <div className="grid gap-1">
            {themes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-stone-50 ${active.id === item.id ? 'bg-brand-50' : ''}`}
                onClick={() => {
                  setTheme(item.id)
                  setOpen(false)
                }}
              >
                <span className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: item.swatch }} />
                <span className="min-w-0"><span className="block text-sm font-medium text-brand-950">{item.label}</span><span className="block text-[11px] text-stone-500">{item.description}</span></span>
                {active.id === item.id ? <span className="ml-auto text-xs font-semibold text-brand-700">Active</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
