import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './authContext'
import { authService } from '../services/authService'
import type { User } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On first load, ask the API who is logged in (the cookie survives a refresh).
  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    setUser(await authService.login(email, password))
  }

  const register = async (fullName: string, email: string, password: string) => {
    setUser(await authService.register(fullName, email, password))
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}