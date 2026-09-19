import { createContext, useContext, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const store = useAuthStore()
  const value = useMemo(() => store, [store.user, store.token, store.loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
