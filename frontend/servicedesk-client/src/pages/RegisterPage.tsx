import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessages } from '../utils/errors'

export function RegisterPage() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/tickets" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (password !== confirm) {
      setErrors(['Passwords do not match.'])
      return
    }

    setSubmitting(true)
    try {
      await register(fullName, email, password)
      navigate('/tickets')
    } catch (err) {
      setErrors(getErrorMessages(err))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'mt-1 w-full rounded border border-slate-300 px-3 py-2'
  const labelClass = 'mt-4 block text-sm font-medium text-slate-700'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">Register as an employee to submit tickets.</p>

        {errors.length > 0 && (
          <div role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <label className={labelClass} htmlFor="fullName">Full name</label>
        <input id="fullName" required minLength={2} value={fullName}
          onChange={(e) => setFullName(e.target.value)} className={inputClass} />

        <label className={labelClass} htmlFor="email">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputClass} />

        <label className={labelClass} htmlFor="password">Password</label>
        <input id="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        <p className="mt-1 text-xs text-slate-500">
          At least 8 characters, with an uppercase letter, a lowercase letter and a number.
        </p>

        <label className={labelClass} htmlFor="confirm">Confirm password</label>
        <input id="confirm" type="password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)} className={inputClass} />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}