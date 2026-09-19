import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { useNotify } from '../context/NotificationContext'
import { DEMO_ACCOUNTS } from '../utils/constants'

export default function Login() {
  const { register, handleSubmit, setValue } = useForm()
  const { login, loading } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = async (values) => {
    setError('')
    try {
      const { home } = await login(values)
      notify.push({ type: 'success', title: 'Welcome back', message: 'Demo session started.' })
      navigate(home)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-brand-950">Log in</h2>
      <p className="mt-1 text-sm text-stone-500">Use a seeded demo account — no backend required.</p>
      <form className="mt-6 grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Email" {...register('email', { required: true })} />
        <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="password" placeholder="Password" {...register('password', { required: true })} />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-stone-400">Demo accounts</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-900"
              onClick={() => {
                setValue('email', account.email)
                setValue('password', account.password)
              }}
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-stone-500">
        New here? <Link to="/register" className="font-semibold text-brand-800">Register</Link>
      </p>
    </div>
  )
}
