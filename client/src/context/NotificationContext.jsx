import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type: 'info', ...toast }])
    setTimeout(() => dismiss(id), 4200)
  }, [dismiss])

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-900'
                : toast.type === 'success'
                  ? 'border-brand-200 bg-brand-50 text-brand-950'
                  : 'border-stone-200 bg-white text-ink'
            }`}
          >
            <p className="font-medium">{toast.title}</p>
            {toast.message ? <p className="mt-0.5 text-stone-600">{toast.message}</p> : null}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider')
  return ctx
}
