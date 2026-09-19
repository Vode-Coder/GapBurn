const TOKEN_KEY = 'gapburn_token'
const USER_KEY = 'gapburn_user'

export const tokenService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  },
  getUser() {
    const raw = localStorage.getItem(USER_KEY)
    try {
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setUser(user) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
