import { create } from 'zustand'
import { authApi } from '../api/authApi'
import { tokenService } from '../services/tokenService'
import { ROLE_HOME } from '../utils/constants'

export const useAuthStore = create((set, get) => ({
  user: tokenService.getUser(),
  token: tokenService.getToken(),
  loading: false,
  async login(credentials) {
    set({ loading: true })
    try {
      const { user, token } = await authApi.login(credentials)
      tokenService.setToken(token)
      tokenService.setUser(user)
      set({ user, token, loading: false })
      return { user, home: ROLE_HOME[user.role] || '/' }
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  async register(payload) {
    set({ loading: true })
    try {
      const { user, token } = await authApi.register(payload)
      tokenService.setToken(token)
      tokenService.setUser(user)
      set({ user, token, loading: false })
      return { user, home: ROLE_HOME[user.role] || '/' }
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  logout() {
    tokenService.clear()
    set({ user: null, token: null })
    authApi.logout().catch(() => {})
  },
  isAuthenticated() {
    return Boolean(get().token && get().user)
  },
}))
