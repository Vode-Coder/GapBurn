import { Flame } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="grain min-h-screen bg-brand-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-brand-100">
            <Flame className="text-saffron-500" />
            <span className="font-display text-2xl">GapBurn</span>
          </Link>
          <h1 className="mt-8 font-display text-4xl leading-tight md:text-5xl">
            Burn the gap between classroom skill and industry demand.
          </h1>
          <p className="mt-4 max-w-md text-brand-100/80">
            SIH 2026 · Ministry of Ayush · Career Digital Twin for students, faculty, institutions, and industry.
          </p>
        </div>
        <div className="rounded-3xl bg-paper p-6 text-ink shadow-2xl md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
