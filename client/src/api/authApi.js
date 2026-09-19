import { axiosInstance } from './axiosInstance'

const unwrap = async (promise) => {
  const { data } = await promise
  return data.data
}

export const authApi = {
  login: (payload) => unwrap(axiosInstance.post('/auth/login', payload)),
  register: (payload) => unwrap(axiosInstance.post('/auth/register', payload)),
  me: () => unwrap(axiosInstance.get('/auth/me')),
  logout: () => unwrap(axiosInstance.post('/auth/logout')),
  changePassword: (payload) => unwrap(axiosInstance.put('/auth/change-password', payload)),
}

export const studentApi = {
  profile: () => unwrap(axiosInstance.get('/students/profile')),
  updateProfile: (payload) => unwrap(axiosInstance.put('/students/profile', payload)),
  skillTwin: () => unwrap(axiosInstance.get('/students/skill-twin')),
  skills: () => unwrap(axiosInstance.get('/students/skills')),
  addSkill: (payload) => unwrap(axiosInstance.post('/students/skills', payload)),
  skillGaps: () => unwrap(axiosInstance.get('/students/skill-gaps')),
  documents: () => unwrap(axiosInstance.get('/students/documents')),
  uploadDocument: (payload) => unwrap(axiosInstance.post('/students/documents', payload)),
  confirmDocument: (id) => unwrap(axiosInstance.post(`/students/documents/${id}/confirm`)),
  timeline: () => unwrap(axiosInstance.get('/students/timeline')),
  addTimeline: (payload) => unwrap(axiosInstance.post('/students/timeline', payload)),
  updateTimeline: (id, payload) => unwrap(axiosInstance.put(`/students/timeline/${id}`, payload)),
  assessments: () => unwrap(axiosInstance.get('/students/assessments')),
  assignments: () => unwrap(axiosInstance.get('/students/assignments')),
  attemptAssessment: (id) => unwrap(axiosInstance.post(`/students/assessments/${id}/attempt`)),
  learningPath: () => unwrap(axiosInstance.get('/students/learning-path')),
  generateLearningPath: () => unwrap(axiosInstance.post('/students/learning-path/generate')),
  projects: () => unwrap(axiosInstance.get('/students/projects')),
  addProject: (payload) => unwrap(axiosInstance.post('/students/projects', payload)),
  updateProject: (id, payload) => unwrap(axiosInstance.put(`/students/projects/${id}`, payload)),
  generateProject: (payload) => unwrap(axiosInstance.post('/students/projects/generate', payload)),
  applications: () => unwrap(axiosInstance.get('/students/applications')),
  portfolio: () => unwrap(axiosInstance.get('/students/portfolio')),
  simulation: () => unwrap(axiosInstance.get('/students/simulations')),
}

export const internshipApi = {
  list: () => unwrap(axiosInstance.get('/internships')),
  apply: (id) => unwrap(axiosInstance.post(`/internships/${id}/apply`)),
  create: (payload) => unwrap(axiosInstance.post('/internships', payload)),
}

export const jobApi = {
  list: () => unwrap(axiosInstance.get('/jobs')),
  apply: (id) => unwrap(axiosInstance.post(`/jobs/${id}/apply`)),
  create: (payload) => unwrap(axiosInstance.post('/jobs', payload)),
}

export const industryApi = {
  profile: () => unwrap(axiosInstance.get('/industry/profile')),
  applicants: () => unwrap(axiosInstance.get('/industry/applicants')),
  skillRadar: () => unwrap(axiosInstance.get('/industry/skill-radar')),
  skillProfile: () => unwrap(axiosInstance.get('/industry/skill-profile')),
  assignments: () => unwrap(axiosInstance.get('/industry/assignments')),
  createAssignment: (payload) => unwrap(axiosInstance.post('/industry/assignments', payload)),
  updateSkillProfile: (payload) => unwrap(axiosInstance.put('/industry/skill-profile', payload)),
  updateApplicationStatus: (id, status) =>
    unwrap(axiosInstance.put(`/industry/applications/${id}/status`, { status })),
}

export const academicianApi = {
  profile: () => unwrap(axiosInstance.get('/academician/profile')),
  students: () => unwrap(axiosInstance.get('/academician/students')),
  createStudent: (payload) => unwrap(axiosInstance.post('/academician/students', payload)),
  removeStudent: (id) => unwrap(axiosInstance.delete(`/academician/students/${id}`)),
  verifications: () => unwrap(axiosInstance.get('/academician/verifications')),
  decide: (id, payload) => unwrap(axiosInstance.put(`/academician/verifications/${id}`, payload)),
  mentorship: () => unwrap(axiosInstance.get('/academician/mentorship')),
}

export const institutionApi = {
  profile: () => unwrap(axiosInstance.get('/institution/profile')),
  analytics: () => unwrap(axiosInstance.get('/institution/analytics')),
  placements: () => unwrap(axiosInstance.get('/institution/placements')),
  skillGaps: () => unwrap(axiosInstance.get('/institution/skill-gaps')),
  industryCatalog: () => unwrap(axiosInstance.get('/institution/industry')),
}

export const adminApi = {
  users: () => unwrap(axiosInstance.get('/admin/users')),
  createUser: (payload) => unwrap(axiosInstance.post('/admin/users', payload)),
  audit: () => unwrap(axiosInstance.get('/admin/audit')),
  toggleUser: (id) => unwrap(axiosInstance.put(`/admin/users/${id}/toggle`)),
}

export const notificationApi = {
  list: () => unwrap(axiosInstance.get('/notifications')),
  markRead: (id) => unwrap(axiosInstance.put(`/notifications/${id}/read`)),
  markAllRead: () => unwrap(axiosInstance.put('/notifications/read-all')),
}
