import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(value) {
  if (!value) return '—'
  return format(new Date(value), 'dd MMM yyyy')
}

export function formatRelative(value) {
  if (!value) return '—'
  return formatDistanceToNow(new Date(value), { addSuffix: true })
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
