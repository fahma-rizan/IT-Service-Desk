import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading, login, logout } = useAuth()

  if (loading) {
    return <p className="p-8 text-slate-600">Loading...</p>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-800">ServiceDesk Pro</h1>
        <p className="mt-2 text-slate-600">
          {user ? `Logged in as ${user.fullName} (${user.roles.join(', ')})` : 'Not logged in'}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-white"
            onClick={() => login('employee1@example.com', 'Password123')}
          >
            Test login
          </button>
          <button className="rounded bg-slate-600 px-3 py-1 text-white" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default App