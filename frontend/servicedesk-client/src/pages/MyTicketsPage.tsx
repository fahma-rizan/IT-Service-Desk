import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PriorityBadge, StatusBadge } from '../components/Badges'
import { ticketService } from '../services/ticketService'
import { getErrorMessages } from '../utils/errors'
import { formatDate, labelize } from '../utils/format'
import type { Ticket, TicketStatus } from '../types'

const STATUSES: TicketStatus[] = ['Open', 'Assigned', 'InProgress', 'Resolved', 'Closed']

export function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TicketStatus | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Wait 300 ms after typing stops before asking the API.
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      ticketService
        .getMyTickets(search.trim(), status)
        .then((data) => {
          if (!cancelled) {
            setTickets(data)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(getErrorMessages(err)[0])
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [search, status])

  const filtering = search.trim() !== '' || status !== ''

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">My Tickets</h1>
        <Link to="/tickets/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          New ticket
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input type="search" placeholder="Search title or description..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 sm:max-w-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus | '')}
          className="rounded border border-slate-300 bg-white px-3 py-2">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{labelize(s)}</option>
          ))}
        </select>
      </div>

      {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-6 text-slate-500">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="mt-6 text-slate-500">
          {filtering ? 'No tickets match your search.' : 'You have not submitted any tickets yet.'}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{t.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/tickets/${t.id}`} className="font-medium text-blue-600 hover:underline">
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{t.categoryName}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}