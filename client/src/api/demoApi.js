import { createInitialState } from '../data/demoData'
import { computeGap, levelToScore } from '../utils/scoreCalculator'
import { VERIFICATION_STATUS } from '../utils/constants'

const KEY = 'gapburn_demo_state'
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

function loadState() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return createInitialState()
  try {
    const initial = createInitialState()
    const saved = JSON.parse(raw)
    const savedNotifications = saved.notifications || []
    const seededNotifications = initial.notifications.map((notification) =>
      savedNotifications.find((savedNotification) => savedNotification.id === notification.id) || notification,
    )
    const customNotifications = savedNotifications.filter(
      (notification) => !initial.notifications.some((seed) => seed.id === notification.id),
    )
    const savedAnalytics = saved.institutionAnalytics || {}
    const savedPlacements = savedAnalytics.placementRecords || []
    const seededPlacements = initial.institutionAnalytics.placementRecords.map((placement) =>
      savedPlacements.find((savedPlacement) => savedPlacement.id === placement.id) || placement,
    )
    const customPlacements = savedPlacements.filter(
      (placement) => !initial.institutionAnalytics.placementRecords.some((seed) => seed.id === placement.id),
    )
    return {
      ...initial,
      ...saved,
      institutionAnalytics: {
        ...initial.institutionAnalytics,
        ...savedAnalytics,
        placementRecords: [...seededPlacements, ...customPlacements],
      },
      notifications: [...seededNotifications, ...customNotifications],
    }
  } catch {
    return createInitialState()
  }
}

let state = loadState()

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state))
}

function publicUser(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

function skillMap() {
  return Object.fromEntries(state.skills.map((s) => [s.id, s]))
}

function studentSkills(studentId) {
  const skills = skillMap()
  return state.skillEvidence
    .filter((e) => e.studentId === studentId)
    .map((e) => ({
      ...e,
      name: skills[e.skillId]?.name ?? e.skillId,
      category: skills[e.skillId]?.category ?? 'General',
    }))
}

function getStudentProfile(studentId) {
  if (!studentId) return state.studentProfile
  if (!state.studentProfiles) state.studentProfiles = {}
  const user = state.users.find((u) => u.id === studentId)
  if (!state.studentProfiles[studentId]) {
    state.studentProfiles[studentId] = {
      ...state.studentProfile,
      userId: studentId,
      name: user?.name || state.studentProfile.name,
      college: state.studentProfile.college,
      degree: state.studentProfile.degree,
      branch: state.studentProfile.branch,
      semester: state.studentProfile.semester,
      graduationYear: state.studentProfile.graduationYear,
      targetRole: state.studentProfile.targetRole,
      location: state.studentProfile.location,
      bio: state.studentProfile.bio,
    }
  }
  return state.studentProfiles[studentId]
}

function getIndustryProfile(industryId) {
  if (!state.industryProfiles) state.industryProfiles = {}
  if (!state.industryProfiles[industryId]) {
    const user = state.users.find((item) => item.id === industryId)
    state.industryProfiles[industryId] = {
      ...state.industryProfile,
      userId: industryId,
      companyName: user?.name || state.industryProfile.companyName,
    }
  }
  return state.industryProfiles[industryId]
}

function getAcademicianProfile(academicianId) {
  if (!state.academicianProfiles) state.academicianProfiles = {}
  if (!state.academicianProfiles[academicianId]) {
    const user = state.users.find((item) => item.id === academicianId)
    state.academicianProfiles[academicianId] = {
      ...state.academicianProfile,
      userId: academicianId,
      name: user?.name || state.academicianProfile.name,
    }
  }
  return state.academicianProfiles[academicianId]
}

function getStudentTimeline(studentId) {
  if (!state.studentTimelines) state.studentTimelines = {}
  if (!state.studentTimelines[studentId]) {
    state.studentTimelines[studentId] = state.timeline
      .filter((event) => !event.studentId || event.studentId === studentId)
      .map((event) => ({ ...event, studentId }))
  }
  return state.studentTimelines[studentId]
}

function buildTwin(studentId) {
  const skills = studentSkills(studentId)
  const profile = getStudentProfile(studentId)
  const gaps = state.roleTemplate.map((req) => {
    const owned = skills.find((s) => s.name === req.name)
    const currentLevel = owned?.level ?? 'None'
    return {
      skill: req.name,
      required: req.required,
      requiredLevel: req.level,
      currentLevel,
      currentScore: owned ? levelToScore(owned.level) : 0,
      requiredScore: levelToScore(req.level),
      gap: computeGap(owned?.level, req.level),
      verificationStatus: owned?.verificationStatus ?? 'Missing',
    }
  })
  return {
    profile,
    scores: {
      careerReadinessScore: profile.careerReadinessScore,
      skillTwinScore: profile.skillTwinScore,
      profileCompleteness: profile.profileCompleteness,
    },
    skills,
    gaps,
    dna: skills.map((s) => ({
      name: s.name,
      confidence: s.confidence,
      verificationStatus: s.verificationStatus,
      level: s.level,
    })),
  }
}

function matchBreakdownFor(requiredSkills) {
  const owned = studentSkills('u-student')
  const overlap =
    requiredSkills.filter((name) => owned.some((s) => s.name === name)).length /
    Math.max(requiredSkills.length, 1)
  const verifiedShare =
    owned.filter((s) =>
      [VERIFICATION_STATUS.FACULTY_VERIFIED, VERIFICATION_STATUS.INDUSTRY_VERIFIED].includes(
        s.verificationStatus,
      ),
    ).length / Math.max(owned.length, 1)
  return {
    skillOverlap: Math.round(overlap * 100),
    verification: Math.round(40 + verifiedShare * 60),
    assessments: 78,
    projects: owned.some((s) => s.evidenceType === 'project') ? 80 : 55,
  }
}

function matchScore(breakdown) {
  return Math.round(
    breakdown.skillOverlap * 0.45 +
      breakdown.verification * 0.2 +
      breakdown.assessments * 0.2 +
      breakdown.projects * 0.15,
  )
}

function withMatch(item, requiredSkills) {
  const matchBreakdown = matchBreakdownFor(requiredSkills)
  return { ...item, matchBreakdown, matchScore: matchScore(matchBreakdown) }
}

function parseBody(data) {
  if (!data) return {}
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }
  return data
}

function pathOf(url = '') {
  return url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '') || '/'
}

class ApiError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message)
    this.status = status
    this.code = code
  }
}

function requireUser(headers) {
  const auth = headers?.Authorization || headers?.authorization || ''
  const token = auth.replace('Bearer ', '')
  const userId = state.sessions[token]
  const user = state.users.find((u) => u.id === userId)
  if (!user) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
  return user
}

export async function handleDemoRequest({ method, url, data, headers }) {
  await delay()
  const path = pathOf(url)
  const verb = (method || 'get').toUpperCase()
  const body = parseBody(data)

  if (verb === 'POST' && path === '/auth/login') {
    const user = state.users.find(
      (u) => u.email === body.email && u.password === body.password && u.isActive,
    )
    if (!user) throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    const token = `demo.${user.id}.${Date.now()}`
    state.sessions[token] = user.id
    persist()
    return { user: publicUser(user), token }
  }

  if (verb === 'POST' && path === '/auth/register') {
    const exists = state.users.some((u) => u.email === body.email)
    if (exists) throw new ApiError('Email already registered', 409, 'EMAIL_TAKEN')
    const id = `u-${Date.now()}`
    const user = {
      id,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    state.users.push(user)
    persist()
    const token = `demo.${id}.${Date.now()}`
    state.sessions[token] = id
    return { user: publicUser(user), token }
  }

  if (verb === 'POST' && path === '/auth/logout') {
    return { ok: true }
  }

  const user = requireUser(headers)

  if (verb === 'GET' && path === '/auth/me') return publicUser(user)

  if (verb === 'PUT' && path === '/auth/change-password') {
    if (user.password !== body.currentPassword) throw new ApiError('Current password is wrong', 400)
    user.password = body.newPassword
    persist()
    return { ok: true }
  }

  if (path.startsWith('/students')) {
    if (verb === 'GET' && path === '/students/profile') return { ...publicUser(user), ...getStudentProfile(user.id) }
    if (verb === 'PUT' && path === '/students/profile') {
      const profile = getStudentProfile(user.id)
      Object.assign(profile, body)
      persist()
      return { ...publicUser(user), ...profile }
    }
    if (verb === 'GET' && path === '/students/skill-twin') return buildTwin(user.id)
    if (verb === 'GET' && path === '/students/skills') return studentSkills(user.id)
    if (verb === 'POST' && path === '/students/skills') {
      const skill =
        state.skills.find((s) => s.name.toLowerCase() === String(body.name || '').toLowerCase()) ||
        (() => {
          const created = {
            id: `sk-${Date.now()}`,
            name: body.name,
            category: body.category || 'General',
            description: '',
          }
          state.skills.push(created)
          return created
        })()
      const ev = {
        id: `ev-${Date.now()}`,
        studentId: user.id,
        skillId: skill.id,
        evidenceType: 'self',
        confidence: 40,
        verificationStatus: VERIFICATION_STATUS.SELF_REPORTED,
        level: body.level || 'Beginner',
        extractedFrom: 'Manual add',
        createdAt: new Date().toISOString(),
      }
      state.skillEvidence.push(ev)
      persist()
      return { ...ev, name: skill.name, category: skill.category }
    }
    if (verb === 'GET' && path === '/students/skill-gaps') return buildTwin(user.id).gaps
    if (verb === 'GET' && path === '/students/documents') return state.documents.filter((d) => d.studentId === user.id)
    if (verb === 'POST' && path === '/students/documents') {
      const fileName = body.fileName || 'upload.pdf'
      const extractedSkills = fileName.toLowerCase().includes('gcp')
        ? ['GCP / Clinical Trials']
        : ['Clinical Documentation']
      const doc = {
        id: `doc-${Date.now()}`,
        studentId: user.id,
        fileName,
        fileType: 'application/pdf',
        filePath: `/uploads/${fileName}`,
        uploadedAt: new Date().toISOString(),
        extractedText: `Demo OCR extracted text from ${fileName}`,
        extractedSkills,
        extractedOrg: 'Unknown issuer',
        extractedDates: {},
        verificationStatus: 'AI Extracted',
      }
      state.documents.unshift(doc)
      persist()
      return doc
    }
    const confirm = path.match(/^\/students\/documents\/([^/]+)\/confirm$/)
    if (verb === 'POST' && confirm) {
      const doc = state.documents.find((d) => d.id === confirm[1])
      if (!doc) throw new ApiError('Document not found', 404)
      doc.verificationStatus = 'User Confirmed'
      persist()
      return doc
    }
    if (verb === 'GET' && path === '/students/timeline') {
      return getStudentTimeline(user.id).slice().sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    if (verb === 'POST' && path === '/students/timeline') {
      const title = String(body.title || '').trim()
      const description = String(body.description || '').trim()
      if (!title || !description || !body.date) throw new ApiError('Title, description, and date are required', 400, 'MISSING_FIELDS')
      const event = {
        id: `tl-${Date.now()}`,
        studentId: user.id,
        type: body.type || 'milestone',
        title,
        description,
        date: body.date,
        source: 'student-added',
        createdAt: new Date().toISOString(),
      }
      getStudentTimeline(user.id).push(event)
      persist()
      return event
    }
    const timelineEdit = path.match(/^\/students\/timeline\/([^/]+)$/)
    if (verb === 'PUT' && timelineEdit) {
      const event = getStudentTimeline(user.id).find((item) => item.id === timelineEdit[1])
      if (!event) throw new ApiError('Timeline event not found', 404)
      Object.assign(event, {
        type: body.type || event.type,
        title: String(body.title || event.title).trim(),
        description: String(body.description || event.description).trim(),
        date: body.date || event.date,
        source: event.source === 'student-added' ? event.source : 'student-updated',
      })
      persist()
      return event
    }
    if (verb === 'GET' && path === '/students/assessments') return state.assessments
    if (verb === 'GET' && path === '/students/assignments') return state.assignments
    if (verb === 'GET' && path === '/students/learning-path') return state.learningPath
    if (verb === 'POST' && path === '/students/learning-path/generate') {
      state.learningPath.generatedAt = new Date().toISOString()
      persist()
      return state.learningPath
    }
    if (verb === 'GET' && path === '/students/projects') return state.projects.filter((project) => !project.studentId || project.studentId === user.id)
    if (verb === 'POST' && path === '/students/projects') {
      const project = {
        id: `pr-${Date.now()}`,
        studentId: user.id,
        title: String(body.title || 'New portfolio project').trim(),
        description: String(body.description || '').trim(),
        skills: Array.isArray(body.skills) ? body.skills : String(body.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean),
        githubUrl: body.githubUrl || '',
        liveUrl: body.liveUrl || '',
        status: body.status || 'submitted',
        isAIGenerated: false,
        createdAt: new Date().toISOString(),
      }
      if (!project.title || !project.description) throw new ApiError('Project title and description are required', 400, 'MISSING_FIELDS')
      state.projects.unshift(project)
      persist()
      return project
    }
    const projectEdit = path.match(/^\/students\/projects\/([^/]+)$/)
    if (verb === 'PUT' && projectEdit) {
      const project = state.projects.find((item) => item.id === projectEdit[1] && item.studentId === user.id)
      if (!project) throw new ApiError('Project not found', 404)
      Object.assign(project, {
        title: String(body.title || project.title).trim(),
        description: String(body.description || project.description).trim(),
        skills: Array.isArray(body.skills) ? body.skills : String(body.skills || project.skills.join(',')).split(',').map((skill) => skill.trim()).filter(Boolean),
        githubUrl: body.githubUrl ?? project.githubUrl,
        liveUrl: body.liveUrl ?? project.liveUrl,
      })
      persist()
      return project
    }
    if (verb === 'POST' && path === '/students/projects/generate') {
      const project = {
        id: `pr-${Date.now()}`,
        studentId: user.id,
        title: body.title || 'Industry mini-trial CRF audit',
        description:
          body.description ||
          'AI-generated project: audit 15 mock CRFs for completeness, prakriti fields, and AE flags.',
        skills: body.skills || ['GCP / Clinical Trials', 'Clinical Documentation'],
        githubUrl: '',
        liveUrl: '',
        status: 'in-progress',
        isAIGenerated: true,
        createdAt: new Date().toISOString(),
      }
      state.projects.unshift(project)
      persist()
      return project
    }
    if (verb === 'GET' && path === '/students/applications') {
      return state.applications.filter((a) => a.applicantId === user.id)
    }
    if (verb === 'GET' && path === '/students/portfolio') {
      return {
        profile: { ...publicUser(user), ...getStudentProfile(user.id) },
        skills: studentSkills(user.id),
        projects: state.projects,
        documents: state.documents,
      }
    }
    const attempt = path.match(/^\/students\/assessments\/([^/]+)\/attempt$/)
    if (verb === 'POST' && attempt) {
      const assessment = state.assessments.find((a) => a.id === attempt[1])
      const result = {
        id: `at-${Date.now()}`,
        studentId: user.id,
        assessmentId: attempt[1],
        score: 70 + Math.floor(Math.random() * 20),
        level: 'Intermediate',
        strengths: ['Protocol reading'],
        weaknesses: ['Statistical power'],
        completedAt: new Date().toISOString(),
        title: assessment?.title,
      }
      state.attempts.unshift(result)
      persist()
      return result
    }
    if (verb === 'GET' && path === '/students/simulations') {
      return {
        fromProfile: getStudentProfile(user.id),
        targetRole: getStudentProfile(user.id).targetRole,
        estimatedReadiness: 72,
        pathOptions: [
          { name: 'Clinical research track', months: 4, lift: 18 },
          { name: 'Hospital operations track', months: 3, lift: 9 },
          { name: 'Ayur-tech analytics track', months: 5, lift: 14 },
        ],
      }
    }
  }

  if (path.startsWith('/internships')) {
    if (verb === 'GET' && path === '/internships') {
      return state.internships.map((i) => withMatch(i, i.requiredSkills))
    }
    const apply = path.match(/^\/internships\/([^/]+)\/apply$/)
    if (verb === 'POST' && apply) {
      const internship = state.internships.find((i) => i.id === apply[1])
      if (!internship) throw new ApiError('Not found', 404)
      const exists = state.applications.some(
        (a) => a.applicantId === user.id && a.opportunityId === internship.id,
      )
      if (exists) throw new ApiError('Already applied', 409)
      const matched = withMatch(internship, internship.requiredSkills)
      const application = {
        id: `app-${Date.now()}`,
        applicantId: user.id,
        opportunityId: internship.id,
        opportunityType: 'internship',
        title: internship.title,
        companyName: internship.companyName,
        status: 'Applied',
        matchScore: matched.matchScore,
        matchBreakdown: matched.matchBreakdown,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.applications.unshift(application)
      persist()
      return application
    }
    if (verb === 'POST' && path === '/internships') {
      const item = {
        id: `int-${Date.now()}`,
        industryId: user.id,
        companyName: getIndustryProfile(user.id).companyName,
        status: 'active',
        openings: Number(body.openings || 1),
        ...body,
      }
      state.internships.unshift(item)
      persist()
      return item
    }
  }

  if (path.startsWith('/jobs')) {
    if (verb === 'GET' && path === '/jobs') {
      return state.jobs.map((j) => withMatch(j, j.requiredSkills))
    }
    const apply = path.match(/^\/jobs\/([^/]+)\/apply$/)
    if (verb === 'POST' && apply) {
      const job = state.jobs.find((j) => j.id === apply[1])
      if (!job) throw new ApiError('Not found', 404)
      const matched = withMatch(job, job.requiredSkills)
      const application = {
        id: `app-${Date.now()}`,
        applicantId: user.id,
        opportunityId: job.id,
        opportunityType: 'job',
        title: job.title,
        companyName: job.companyName,
        status: 'Applied',
        matchScore: matched.matchScore,
        matchBreakdown: matched.matchBreakdown,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.applications.unshift(application)
      persist()
      return application
    }
    if (verb === 'POST' && path === '/jobs') {
      const item = {
        id: `job-${Date.now()}`,
        industryId: user.id,
        companyName: getIndustryProfile(user.id).companyName,
        status: 'active',
        ...body,
      }
      state.jobs.unshift(item)
      persist()
      return item
    }
  }

  if (path.startsWith('/industry')) {
    if (verb === 'GET' && path === '/industry/profile') return { ...publicUser(user), ...getIndustryProfile(user.id) }
    if (verb === 'GET' && path === '/industry/assignments') {
      return state.assignments.filter((assignment) => assignment.industryId === user.id)
    }
    if (verb === 'POST' && path === '/industry/assignments') {
      const assignment = {
        id: `asg-${Date.now()}`,
        industryId: user.id,
        title: body.title || 'Industry assignment',
        description: body.description || '',
        requiredSkills: Array.isArray(body.requiredSkills)
          ? body.requiredSkills
          : String(body.requiredSkills || '').split(',').map((skill) => skill.trim()).filter(Boolean),
        difficulty: body.difficulty || 'Intermediate',
        duration: body.duration || '30 mins',
        deadline: body.deadline || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'open',
      }
      state.assignments.unshift(assignment)
      persist()
      return assignment
    }
    if (verb === 'GET' && path === '/industry/applicants') {
      return state.applications.map((a) => ({
        ...a,
        applicantName: 'Aarav Mehta',
        college: state.studentProfile.college,
        readiness: state.studentProfile.careerReadinessScore,
      }))
    }
    if (verb === 'GET' && path === '/industry/skill-radar') {
      return studentSkills('u-student').map((s) => ({
        skill: s.name,
        student: s.confidence,
        required:
          state.industrySkillProfile.requiredSkills.find((r) => r.name === s.name)
            ? levelToScore(
                state.industrySkillProfile.requiredSkills.find((r) => r.name === s.name).level,
              )
            : 40,
      }))
    }
    if (verb === 'GET' && path === '/industry/skill-profile') return state.industrySkillProfile
    if (verb === 'PUT' && path === '/industry/skill-profile') {
      state.industrySkillProfile = { ...state.industrySkillProfile, ...body }
      persist()
      return state.industrySkillProfile
    }
    const status = path.match(/^\/industry\/applications\/([^/]+)\/status$/)
    if (verb === 'PUT' && status) {
      const app = state.applications.find((a) => a.id === status[1])
      if (!app) throw new ApiError('Not found', 404)
      app.status = body.status
      app.updatedAt = new Date().toISOString()
      persist()
      return app
    }
  }

  if (path.startsWith('/academician') || path.startsWith('/faculty')) {
    if (verb === 'GET' && (path === '/academician/profile' || path === '/faculty/profile')) {
      return { ...publicUser(user), ...getAcademicianProfile(user.id) }
    }
    if (verb === 'POST' && (path === '/academician/students' || path === '/faculty/students')) {
      const exists = state.users.some((item) => item.email === body.email)
      if (exists) throw new ApiError('Student with this email already exists', 409, 'EMAIL_TAKEN')

      const name = String(body.name || 'New Student').trim() || 'New Student'
      const email = String(body.email || `${name.toLowerCase().replace(/\s+/g, '.') }@gapburn.dev`).trim()
      const password = String(body.password || `Student@${Math.random().toString(36).slice(-6).toUpperCase()}`).trim()
      const student = {
        id: `u-${Date.now()}`,
        name,
        email,
        password,
        role: 'STUDENT',
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      state.users.push(student)
      state.studentProfiles[student.id] = {
        ...state.studentProfile,
        userId: student.id,
        name,
        college: body.college || state.studentProfile.college,
        degree: body.degree || state.studentProfile.degree,
        branch: body.branch || state.studentProfile.branch,
        semester: Number(body.semester || state.studentProfile.semester),
        graduationYear: Number(body.graduationYear || state.studentProfile.graduationYear),
        targetRole: body.targetRole || state.studentProfile.targetRole,
        location: body.location || state.studentProfile.location,
        bio: body.bio || `Student added by faculty on ${new Date().toISOString()}`,
      }
      persist()
      return { user: publicUser(student), credentials: { email, password }, profile: state.studentProfiles[student.id] }
    }

    if (verb === 'DELETE' && (path.startsWith('/academician/students/') || path.startsWith('/faculty/students/'))) {
      const studentId = path.split('/').pop()
      const index = state.users.findIndex((item) => item.id === studentId)
      if (index === -1) throw new ApiError('Student not found', 404)
      state.users.splice(index, 1)
      delete state.studentProfiles[studentId]
      persist()
      return { ok: true }
    }

    if (verb === 'GET' && (path === '/academician/students' || path === '/faculty/students')) {
      return state.users
        .filter((item) => item.role === 'STUDENT')
        .map((student) => ({
          ...publicUser(student),
          ...getStudentProfile(student.id),
        }))
    }
    if (verb === 'GET' && (path === '/academician/verifications' || path === '/faculty/verifications')) {
      return state.verifications
    }
    const decide = path.match(/^\/(?:academician|faculty)\/verifications\/([^/]+)$/)
    if (verb === 'PUT' && decide) {
      const item = state.verifications.find((v) => v.id === decide[1])
      if (!item) throw new ApiError('Not found', 404)
      item.status = body.status
      item.comment = body.comment || ''
      item.verifiedAt = new Date().toISOString()
      persist()
      return item
    }
    if (verb === 'GET' && (path === '/academician/mentorship' || path === '/faculty/mentorship')) {
      return state.mentorship
    }
  }

  if (path.startsWith('/institution')) {
    if (verb === 'GET' && path === '/institution/profile') {
      return { ...publicUser(user), ...state.institutionProfile }
    }
    if (verb === 'GET' && path === '/institution/analytics') return state.institutionAnalytics
    if (verb === 'GET' && path === '/institution/placements') {
      const records = state.institutionAnalytics.placementRecords || []
      const packages = records
        .filter((record) => record.offerType === 'Full-time')
        .map((record) => Number.parseFloat(record.package))
        .filter((value) => Number.isFinite(value))
      const totalPlaced = records.filter((record) => record.status !== 'Offer declined').length
      return {
        funnel: state.institutionAnalytics.placementFunnel,
        records,
        summary: {
          totalPlaced,
          averagePackage: packages.length
            ? `${(packages.reduce((total, value) => total + value, 0) / packages.length).toFixed(1)} LPA`
            : '—',
          highestPackage: packages.length ? `${Math.max(...packages).toFixed(1)} LPA` : '—',
          recruiterCount: new Set(records.map((record) => record.companyName)).size,
        },
      }
    }
    if (verb === 'GET' && path === '/institution/skill-gaps') return state.institutionAnalytics.skillSupply
    if (verb === 'GET' && path === '/institution/industry') return state.institutionIndustryCatalog
  }

  if (path.startsWith('/admin')) {
    if (verb === 'POST' && path === '/admin/users') {
      const allowedRoles = ['STUDENT', 'INDUSTRY', 'ACADEMICIAN']
      if (!allowedRoles.includes(body.role)) {
        throw new ApiError('Admin can add students, industry members, or faculty only', 400, 'INVALID_ROLE')
      }

      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      if (!name || !email) throw new ApiError('Name and email are required', 400, 'MISSING_FIELDS')
      if (state.users.some((item) => item.email.toLowerCase() === email)) {
        throw new ApiError('Email already registered', 409, 'EMAIL_TAKEN')
      }

      const password = String(body.password || `GapBurn@${Math.random().toString(36).slice(-7).toUpperCase()}`)
      const id = `u-${Date.now()}`
      const account = {
        id,
        name,
        email,
        password,
        role: body.role,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
      state.users.push(account)

      if (body.role === 'STUDENT') {
        state.studentProfiles[id] = {
          ...state.studentProfile,
          userId: id,
          name,
          college: body.college || '',
          degree: body.degree || '',
          branch: body.branch || '',
          semester: Number(body.semester || 1),
          graduationYear: Number(body.graduationYear || new Date().getFullYear()),
          targetRole: body.targetRole || '',
          location: body.location || '',
          bio: body.bio || '',
        }
      }

      if (body.role === 'INDUSTRY') {
        state.industryProfiles[id] = {
          ...state.industryProfile,
          userId: id,
          companyName: body.companyName || name,
          industryType: body.industryType || '',
          location: body.location || '',
          description: body.description || '',
          verifiedAt: null,
        }
      }

      if (body.role === 'ACADEMICIAN') {
        state.academicianProfiles[id] = {
          ...state.academicianProfile,
          userId: id,
          name,
          institution: body.institution || '',
          department: body.department || '',
          designation: body.designation || '',
          assignedStudents: [],
        }
      }

      state.notifications.push({
        id: `nt-${Date.now()}`,
        userId: id,
        type: 'account',
        title: 'Welcome to GapBurn',
        message: 'Your account was created by an administrator. Use the generated credentials to sign in.',
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      persist()
      return {
        user: publicUser(account),
        credentials: { email, password },
        profile:
          body.role === 'STUDENT'
            ? state.studentProfiles[id]
            : body.role === 'INDUSTRY'
              ? state.industryProfiles[id]
              : state.academicianProfiles[id],
      }
    }
    if (verb === 'GET' && path === '/admin/users') return state.users.map(publicUser)
    if (verb === 'GET' && path === '/admin/audit') return state.auditLogs
    const toggle = path.match(/^\/admin\/users\/([^/]+)\/toggle$/)
    if (verb === 'PUT' && toggle) {
      const target = state.users.find((u) => u.id === toggle[1])
      if (!target) throw new ApiError('Not found', 404)
      target.isActive = !target.isActive
      persist()
      return publicUser(target)
    }
  }

  if (verb === 'PUT' && path === '/notifications/read-all') {
    state.notifications
      .filter((notification) => notification.userId === user.id)
      .forEach((notification) => {
        notification.isRead = true
      })
    persist()
    return { ok: true }
  }

  const notificationRead = path.match(/^\/notifications\/([^/]+)\/read$/)
  if (verb === 'PUT' && notificationRead) {
    const notification = state.notifications.find(
      (item) => item.id === notificationRead[1] && item.userId === user.id,
    )
    if (!notification) throw new ApiError('Notification not found', 404)
    notification.isRead = true
    persist()
    return notification
  }

  if (verb === 'GET' && path === '/notifications') {
    return state.notifications.filter((n) => n.userId === user.id)
  }

  throw new ApiError(`No demo handler for ${verb} ${path}`, 404, 'NOT_FOUND')
}

export function resetDemoState() {
  state = createInitialState()
  persist()
}
