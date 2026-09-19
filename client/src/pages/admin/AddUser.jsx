import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { adminApi } from '../../api/adminApi'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useNotify } from '../../context/NotificationContext'
import { ROLES } from '../../utils/constants'

const roleLabels = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.INDUSTRY]: 'Industry member',
  [ROLES.ACADEMICIAN]: 'Faculty',
}

export default function AddUser() {
  const [role, setRole] = useState(ROLES.STUDENT)
  const [credentials, setCredentials] = useState(null)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { role: ROLES.STUDENT, semester: 1, graduationYear: new Date().getFullYear() + 4 },
  })
  const notify = useNotify()
  const create = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: (result) => {
      setCredentials(result.credentials)
      notify.push({ type: 'success', title: `${roleLabels[result.user.role]} account created` })
      reset({ role })
    },
  })

  const submit = (values) => create.mutate({ ...values, role })

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm text-stone-500">Super admin workspace</p>
        <h1 className="font-display text-4xl text-brand-950">Add account</h1>
        <p className="mt-2 max-w-2xl text-stone-600">Create a login for a student, industry partner, or faculty member and save the details they need for their workspace.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Account details">
          <form className="grid gap-3" onSubmit={handleSubmit(submit)}>
            <select
              className="rounded-xl border border-stone-300 px-3 py-2.5"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Full name" {...register('name', { required: true })} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="email" placeholder="Login email" {...register('email', { required: true })} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Password (optional: auto-generated)" {...register('password')} />

            {role === ROLES.STUDENT ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="College" {...register('college')} />
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Degree" {...register('degree')} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Branch" {...register('branch')} />
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="number" placeholder="Semester" {...register('semester')} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="number" placeholder="Graduation year" {...register('graduationYear')} />
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Target role" {...register('targetRole')} />
                </div>
                <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Location" {...register('location')} />
              </>
            ) : null}

            {role === ROLES.INDUSTRY ? (
              <>
                <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Company name" {...register('companyName', { required: true })} />
                <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Industry type / sector" {...register('industryType')} />
                <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Company location" {...register('location')} />
                <textarea className="rounded-xl border border-stone-300 px-3 py-2.5" rows={3} placeholder="Company description" {...register('description')} />
              </>
            ) : null}

            {role === ROLES.ACADEMICIAN ? (
              <>
                <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="College / institution" {...register('institution', { required: true })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Department" {...register('department')} />
                  <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Designation" {...register('designation')} />
                </div>
              </>
            ) : null}

            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Card>

        <Card title="Generated credentials">
          {credentials ? (
            <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-950">
              <p className="font-semibold">Share these credentials securely</p>
              <dl className="mt-3 grid gap-2">
                <div><dt className="text-xs text-brand-700">Email</dt><dd className="font-medium">{credentials.email}</dd></div>
                <div><dt className="text-xs text-brand-700">Password</dt><dd className="font-medium">{credentials.password}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-brand-700">The new account can sign in immediately at the login page.</p>
            </div>
          ) : (
            <p className="text-sm text-stone-500">Credentials will appear here after an account is created.</p>
          )}
        </Card>
      </div>
    </div>
  )
}