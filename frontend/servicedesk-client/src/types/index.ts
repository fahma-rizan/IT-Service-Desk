export type TicketType = 'Incident' | 'ServiceRequest'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type TicketStatus = 'Open' | 'Assigned' | 'InProgress' | 'Resolved' | 'Closed'

export interface User {
  id: string
  fullName: string
  email: string
  roles: string[]
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Ticket {
  id: number
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  categoryId: number
  categoryName: string
  createdById: string
  createdByName: string
  assigneeName: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  categoryId: number
  type: TicketType
  priority: TicketPriority
}