export const ROLES = {
  STUDENT: 'STUDENT',
  INDUSTRY: 'INDUSTRY',
  ACADEMICIAN: 'ACADEMICIAN',
  INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
}

export const ROLE_HOME = {
  STUDENT: '/student',
  INDUSTRY: '/industry',
  ACADEMICIAN: '/faculty',
  INSTITUTION_ADMIN: '/institution',
  SUPER_ADMIN: '/admin',
}

export const ROLE_LABELS = {
  STUDENT: 'Student',
  INDUSTRY: 'Industry',
  ACADEMICIAN: 'Academician',
  INSTITUTION_ADMIN: 'Institution',
  SUPER_ADMIN: 'Super Admin',
}

export const VERIFICATION_STATUS = {
  SELF_REPORTED: 'Self Reported',
  AI_EXTRACTED: 'AI Extracted',
  FACULTY_VERIFIED: 'Faculty Verified',
  INDUSTRY_VERIFIED: 'Industry Verified',
}

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export const APPLICATION_STATUSES = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
  'Completed',
]

export const DEMO_ACCOUNTS = [
  { email: 'student@gapburn.dev', password: 'Student@123', role: ROLES.STUDENT, label: 'Student' },
  { email: 'industry@gapburn.dev', password: 'Industry@123', role: ROLES.INDUSTRY, label: 'Industry' },
  { email: 'faculty@gapburn.dev', password: 'Faculty@123', role: ROLES.ACADEMICIAN, label: 'Faculty' },
  {
    email: 'institution@gapburn.dev',
    password: 'Institution@123',
    role: ROLES.INSTITUTION_ADMIN,
    label: 'Institution',
  },
  { email: 'admin@gapburn.dev', password: 'Admin@123', role: ROLES.SUPER_ADMIN, label: 'Admin' },
]
