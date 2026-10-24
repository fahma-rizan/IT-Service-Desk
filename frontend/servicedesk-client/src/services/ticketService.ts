import { api } from './api'
import type { Category, CreateTicketRequest, Ticket, TicketStatus } from '../types'

export const ticketService = {
  getCategories: () => api.get<Category[]>('/categories'),

  createTicket: (data: CreateTicketRequest) => api.post<Ticket>('/tickets', data),

  getMyTickets: (search?: string, status?: TicketStatus | '') => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const query = params.toString()
    return api.get<Ticket[]>(`/tickets/my${query ? `?${query}` : ''}`)
  },

  getTicket: (id: number) => api.get<Ticket>(`/tickets/${id}`),
}