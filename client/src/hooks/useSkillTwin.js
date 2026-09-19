import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../api/studentApi'

export function useSkillTwin() {
  return useQuery({ queryKey: ['skill-twin'], queryFn: studentApi.skillTwin })
}
