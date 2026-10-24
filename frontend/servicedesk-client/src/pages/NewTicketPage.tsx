import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { getErrorMessages } from '../utils/errors'
import { labelize } from '../utils/format'
import type { Category, TicketPriority, TicketType } from '../types'

const TYPES: TicketType[] = ['Incident', 'ServiceRequest']
const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']

export function NewTicketPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [type, setType] = useState<TicketType>('Incident')
  const [priority, setPriority] = useState<TicketPriority>('Medium')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ticketService
      .getCategories()
      .then(setCategories)
      .catch((err) => setErrors(getErrorMessages(err)))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!categoryId) {
      setErrors(['Please choose a category.'])
      return
    }

    setSubmitting(true)
    try {
      const ticket = await ticketService.createTicket({
        title: title.trim(),
        description: description.trim(),
        categoryId: Number(categoryId),
        type,
        priority,
      })
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setErrors(getErrorMessages(err))
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = 'mt-1 w-full rounded border border-slate-300 px-3 py-2'
  const labelClass = 'mt-4 block text-sm font-medium text-slate-700'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
      <h1 className="text-xl font-semibold text-slate-800">Report an issue</h1>
      <p className="mt-1 text-sm text-slate-500">
        Describe the problem or request and our IT team will pick it up.
      </p>

      {errors.length > 0 && (
        <div role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <label className={labelClass} htmlFor="title">Title</label>
      <input id="title" required minLength={5} maxLength={200} value={title}
        onChange={(e) => setTitle(e.target.value)} className={fieldClass}
        placeholder="e.g. Cannot connect to the office Wi-Fi" />

      <label className={labelClass} htmlFor="description">Description</label>
      <textarea id="description" required minLength={10} maxLength={4000} rows={6} value={description}
        onChange={(e) => setDescription(e.target.value)} className={fieldClass}
        placeholder="What happened? What have you already tried?" />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="category">Category</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className={fieldClass}>
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as TicketType)}
            className={fieldClass}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{labelize(t)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="priority">Priority</label>
          <select id="priority" value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)} className={fieldClass}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={submitting}
        className="mt-6 rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        {submitting ? 'Submitting...' : 'Submit ticket'}
      </button>
    </form>
  )
}