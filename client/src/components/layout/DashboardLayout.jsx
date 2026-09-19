import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar role={user?.role} open={open} onClose={() => setOpen(false)} />
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      ) : null}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="grain flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
