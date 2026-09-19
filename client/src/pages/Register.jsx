import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { ROLES, ROLE_LABELS } from '../utils/constants'

export default function Register() {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { role: ROLES.STUDENT } })
  const role = watch('role')
  const { register: signup, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = async (values) => {
    setError('')
    try {
      const { home } = await signup(values)
      navigate(home)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-brand-950">Create account</h2>
      <form className="mt-6 grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Full name" {...register('name', { required: true })} />
        <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Email" {...register('email', { required: true })} />
        <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="password" placeholder="Password" {...register('password', { required: true })} />
        <select className="rounded-xl border border-stone-300 px-3 py-2.5" {...register('role')}>
          {Object.keys(ROLE_LABELS).map((key) => (
            <option key={key} value={key}>
              {ROLE_LABELS[key]}
            </option>
          ))}
        </select>
        {role === ROLES.STUDENT ? (
          <>
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="College" {...register('college')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Degree / branch" {...register('degree')} />
          </>
        ) : null}
        {role === ROLES.INDUSTRY ? (
          <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Company name" {...register('companyName')} />
        ) : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          Register
        </Button>
      </form>
      <p className="mt-6 text-sm text-stone-500">
        Already have an account? <Link to="/login" className="font-semibold text-brand-800">Log in</Link>
      </p>
    </div>
  )
}
