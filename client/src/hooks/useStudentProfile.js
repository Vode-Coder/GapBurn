import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../api/studentApi'

export function useStudentProfile() {
  return useQuery({ queryKey: ['student-profile'], queryFn: studentApi.profile })
}
