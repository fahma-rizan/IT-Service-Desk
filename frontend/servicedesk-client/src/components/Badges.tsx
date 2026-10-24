import type { TicketPriority, TicketStatus } from '../types'
import { labelize } from '../utils/format'

const statusStyles: Record<TicketStatus, string> = {
  Open: 'bg-blue-100 text-blue-700',
  Assigned: 'bg-purple-100 text-purple-700',
  InProgress: 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-slate-200 text-slate-700',
}

const priorityStyles: Record<TicketPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-sky-100 text-sky-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

const base = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium'

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`${base} ${statusStyles[status]}`}>{labelize(status)}</span>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`${base} ${priorityStyles[priority]}`}>{priority}</span>
}