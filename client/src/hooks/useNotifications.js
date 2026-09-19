import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '../api/authApi'
import { useAuth } from './useAuth'

export function useNotifications() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: notificationApi.list,
    enabled: Boolean(user?.id),
  })
}
