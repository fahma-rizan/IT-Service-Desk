import { api } from './api'
import type { User } from '../types'

export const authService = {
  me: () => api.get<User>('/auth/me'),
  login: (email: string, password: string) =>
    api.post<User>('/auth/login', { email, password }),
  register: (fullName: string, email: string, password: string) =>
    api.post<User>('/auth/register', { fullName, email, password }),
  logout: () => api.post<void>('/auth/logout'),
}