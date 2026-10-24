import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to="/tickets" className="text-lg font-bold text-slate-800">
              ServiceDesk Pro
            </Link>
            <nav className="flex gap-1">
              <NavLink to="/tickets" end className={linkClass}>
                My Tickets
              </NavLink>
              <NavLink to="/tickets/new" className={linkClass}>
                New Ticket
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{user?.fullName}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-slate-700 px-3 py-1.5 text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}