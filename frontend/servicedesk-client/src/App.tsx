import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Checking the API...')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => setStatus(`API replied with status ${res.status}`))
      .catch(() => setStatus('Could not reach the API'))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-800">ServiceDesk Pro</h1>
        <p className="mt-2 text-slate-600">{status}</p>
      </div>
    </div>
  )
}

export default App