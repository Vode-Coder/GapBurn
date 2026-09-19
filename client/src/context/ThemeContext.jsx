import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'gapburn_theme'

export const themes = [
  { id: 'forest', label: 'Forest', description: 'Teal and saffron', swatch: '#0f766e' },
  { id: 'ocean', label: 'Ocean', description: 'Blue and coral', swatch: '#2563eb' },
  { id: 'violet', label: 'Violet', description: 'Indigo and gold', swatch: '#6d28d9' },
  { id: 'graphite', label: 'Graphite', description: 'Charcoal and lime', swatch: '#334155' },
]

const ThemeContext = createContext(null)

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return themes.some((theme) => theme.id === saved) ? saved : 'forest'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme, themes }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
