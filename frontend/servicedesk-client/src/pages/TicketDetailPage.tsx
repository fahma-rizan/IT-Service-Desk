import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PriorityBadge, StatusBadge } from '../components/Badges'
import { ApiError } from '../services/api'
import { ticketService } from '../services/ticketService'
import { getErrorMessages } from '../utils/errors'
import { formatDate, labelize } from '../utils/format'
import type { Ticket } from '../types'

export function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ticketService
      .getTicket(Number(id))
      .then((data) => {
        if (!cancelled) setTicket(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError && err.status === 404
            ? 'Ticket not found.'
            : getErrorMessages(err)[0],
        )
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return (
      <div>
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
        <Link to="/tickets" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to My Tickets
        </Link>
      </div>
    )
  }

  if (!ticket) {
    return <p className="text-slate-500">Loading ticket...</p>
  }

  const details: [string, string][] = [
    ['Category', ticket.categoryName],
    ['Type', labelize(ticket.type)],
    ['Submitted by', ticket.createdByName],
    ['Assigned to', ticket.assigneeName ?? 'Not assigned yet'],
    ['Created', formatDate(ticket.createdAt)],
    ['Last updated', formatDate(ticket.updatedAt)],
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/tickets" className="text-sm text-blue-600 hover:underline">
        &larr; Back to My Tickets
      </Link>

      <div className="mt-3 rounded-xl bg-white p-6 shadow">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-slate-800">
            #{ticket.id} {ticket.title}
          </h1>
          <div className="flex gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-6 text-sm font-medium text-slate-500">Description</h2>
        <p className="mt-1 whitespace-pre-wrap text-slate-800">{ticket.description}</p>
      </div>
    </div>
  )
}