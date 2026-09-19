import { Bell, CheckCheck, Menu } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import { academicianApi, institutionApi, industryApi, notificationApi, studentApi } from '../../api/authApi'
import { initials } from '../../utils/formatters'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import { formatDate, formatRelative } from '../../utils/formatters'
import ThemeSwitcher from '../common/ThemeSwitcher'

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { data: notes = [] } = useNotifications()
  const profileQuery = useQuery({
    queryKey: ['account-profile', user?.id, user?.role],
    queryFn: () => {
      if (user?.role === ROLES.STUDENT) return studentApi.profile()
      if (user?.role === ROLES.INDUSTRY) return industryApi.profile()
      if (user?.role === ROLES.ACADEMICIAN) return academicianApi.profile()
      if (user?.role === ROLES.INSTITUTION_ADMIN) return institutionApi.profile()
      return Promise.resolve(user)
    },
    enabled: Boolean(user?.id),
  })
  const unread = notes.filter((n) => !n.isRead).length
  const profile = profileQuery.data || user || {}
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
  const markRead = useMutation({ mutationFn: notificationApi.markRead, onSuccess: refresh })
  const markAllRead = useMutation({ mutationFn: notificationApi.markAllRead, onSuccess: refresh })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200 bg-paper/90 px-4 backdrop-blur">
      <button className="rounded-lg p-2 hover:bg-white lg:hidden" onClick={onMenu}>
        <Menu size={18} />
      </button>
      <div className="flex-1">
        <p className="text-sm text-stone-500">Signed in as</p>
        <p className="text-sm font-semibold">
          {user?.name} · {ROLE_LABELS[user?.role]}
        </p>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="Open notifications"
          aria-expanded={open}
          className="relative rounded-full bg-white p-2 text-brand-800 hover:bg-brand-50"
          onClick={() => setOpen((current) => !current)}
        >
          <Bell size={18} />
          {unread ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron-600 px-1 text-[10px] text-white">
              {unread}
            </span>
          ) : null}
        </button>
        {open ? (
          <div className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <div>
                <p className="font-semibold text-brand-950">Notifications</p>
                <p className="text-xs text-stone-500">{unread ? `${unread} unread` : 'All caught up'}</p>
              </div>
              {unread ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-950"
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              ) : null}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notes.length ? notes.map((note) => (
                <button
                  type="button"
                  key={note.id}
                  className={`block w-full border-b border-stone-100 px-4 py-3 text-left last:border-0 hover:bg-stone-50 ${note.isRead ? '' : 'bg-brand-50/50'}`}
                  onClick={() => {
                    if (!note.isRead) markRead.mutate(note.id)
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sm ${note.isRead ? 'font-medium text-stone-700' : 'font-semibold text-brand-950'}`}>
                      {note.title}
                    </p>
                    {!note.isRead ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron-500" /> : null}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{note.message}</p>
                  <p className="mt-1 text-[11px] text-stone-400">{formatRelative(note.createdAt)}</p>
                </button>
              )) : (
                <p className="px-4 py-8 text-center text-sm text-stone-500">No notifications yet.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <ThemeSwitcher />
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          aria-label="Open profile"
          aria-expanded={profileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-xs font-semibold text-white ring-offset-2 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          onClick={() => setProfileOpen((current) => !current)}
        >
          {initials(user?.name)}
        </button>
        {profileOpen ? (
          <div className="absolute right-0 top-12 z-50 w-[min(92vw,330px)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
            <div className="bg-brand-950 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron-500 font-semibold text-white">{initials(user?.name)}</div>
                <div className="min-w-0"><p className="truncate font-semibold">{profile.name || user?.name}</p><p className="truncate text-xs text-brand-200">{profile.email || user?.email}</p></div>
              </div>
            </div>
            <div className="grid gap-3 p-4 text-sm">
              <div className="flex items-center justify-between gap-3"><span className="text-stone-500">Account type</span><span className="font-medium text-brand-900">{ROLE_LABELS[user?.role]}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-stone-500">Status</span><span className="font-medium text-brand-700">{user?.isActive === false ? 'Inactive' : 'Active'}</span></div>
              {profile.createdAt || user?.createdAt ? <div className="flex items-center justify-between gap-3"><span className="text-stone-500">Member since</span><span className="font-medium text-stone-700">{formatDate(profile.createdAt || user.createdAt)}</span></div> : null}
              {user?.role === ROLES.STUDENT ? <><div className="border-t border-stone-100 pt-3"><p className="font-semibold text-brand-950">Student profile</p><p className="mt-1 text-stone-600">{profile.college || 'College not added'} · {profile.degree || 'Programme not added'}</p><p className="mt-1 text-xs text-stone-500">Target: {profile.targetRole || 'Not set'}</p></div></> : null}
              {user?.role === ROLES.INDUSTRY ? <><div className="border-t border-stone-100 pt-3"><p className="font-semibold text-brand-950">Company profile</p><p className="mt-1 text-stone-600">{profile.companyName || 'Company not added'}</p><p className="mt-1 text-xs text-stone-500">{profile.industryType || 'Industry sector not set'} · {profile.location || 'Location not set'}</p></div></> : null}
              {user?.role === ROLES.ACADEMICIAN ? <><div className="border-t border-stone-100 pt-3"><p className="font-semibold text-brand-950">Faculty profile</p><p className="mt-1 text-stone-600">{profile.institution || 'Institution not added'}</p><p className="mt-1 text-xs text-stone-500">{profile.department || 'Department not set'} · {profile.designation || 'Designation not set'}</p></div></> : null}
              {user?.role === ROLES.INSTITUTION_ADMIN ? <><div className="border-t border-stone-100 pt-3"><p className="font-semibold text-brand-950">Institution profile</p><p className="mt-1 text-stone-600">{profile.institutionName || 'Institution not added'}</p><p className="mt-1 text-xs text-stone-500">{profile.type || 'Type not set'} · {profile.location || 'Location not set'}</p></div></> : null}
              {user?.role === ROLES.SUPER_ADMIN ? <div className="border-t border-stone-100 pt-3 text-xs text-stone-500">You have system-wide administration access.</div> : null}
            </div>
          </div>
        ) : null}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="text-sm text-stone-600 hover:text-ink"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
