import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../utils/constants'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import StudentDashboard from '../pages/student/Dashboard'
import SkillTwin from '../pages/student/SkillTwin'
import Documents from '../pages/student/Documents'
import CareerTimeline from '../pages/student/CareerTimeline'
import SkillGaps from '../pages/student/SkillGaps'
import CareerSimulator from '../pages/student/CareerSimulator'
import LearningPath from '../pages/student/LearningPath'
import ProjectGenerator from '../pages/student/ProjectGenerator'
import Assessment from '../pages/student/Assessment'
import Portfolio from '../pages/student/Portfolio'
import Internships from '../pages/student/Internships'
import Jobs from '../pages/student/Jobs'
import Applications from '../pages/student/Applications'
import IndustryDashboard from '../pages/industry/Dashboard'
import CreateInternship from '../pages/industry/CreateInternship'
import CreateJob from '../pages/industry/CreateJob'
import Assignments from '../pages/industry/Assignments'
import Applicants from '../pages/industry/Applicants'
import SkillRadar from '../pages/industry/SkillRadar'
import SkillProfile from '../pages/industry/SkillProfile'
import FacultyDashboard from '../pages/academician/Dashboard'
import Students from '../pages/academician/Students'
import Verification from '../pages/academician/Verification'
import Mentorship from '../pages/academician/Mentorship'
import InstitutionDashboard from '../pages/institution/Dashboard'
import InstitutionIndustry from '../pages/institution/Industry'
import SkillGapAnalysis from '../pages/institution/SkillGapAnalysis'
import PlacementTracker from '../pages/institution/PlacementTracker'
import AdminDashboard from '../pages/admin/Dashboard'
import AddUser from '../pages/admin/AddUser'
import Users from '../pages/admin/Users'
import AuditLogs from '../pages/admin/AuditLogs'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoleRoute roles={[ROLES.STUDENT]} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/twin" element={<SkillTwin />} />
              <Route path="/student/documents" element={<Documents />} />
              <Route path="/student/timeline" element={<CareerTimeline />} />
              <Route path="/student/gaps" element={<SkillGaps />} />
              <Route path="/student/simulator" element={<CareerSimulator />} />
              <Route path="/student/learning" element={<LearningPath />} />
              <Route path="/student/projects" element={<ProjectGenerator />} />
              <Route path="/student/assessments" element={<Assessment />} />
              <Route path="/student/portfolio" element={<Portfolio />} />
              <Route path="/student/internships" element={<Internships />} />
              <Route path="/student/jobs" element={<Jobs />} />
              <Route path="/student/applications" element={<Applications />} />
            </Route>

            <Route element={<RoleRoute roles={[ROLES.INDUSTRY]} />}>
              <Route path="/industry" element={<IndustryDashboard />} />
              <Route path="/industry/internships/new" element={<CreateInternship />} />
              <Route path="/industry/jobs/new" element={<CreateJob />} />
              <Route path="/industry/assignments" element={<Assignments />} />
              <Route path="/industry/applicants" element={<Applicants />} />
              <Route path="/industry/radar" element={<SkillRadar />} />
              <Route path="/industry/skill-profile" element={<SkillProfile />} />
            </Route>

            <Route element={<RoleRoute roles={[ROLES.ACADEMICIAN]} />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/students" element={<Students />} />
              <Route path="/faculty/verification" element={<Verification />} />
              <Route path="/faculty/mentorship" element={<Mentorship />} />
            </Route>

            <Route element={<RoleRoute roles={[ROLES.INSTITUTION_ADMIN]} />}>
              <Route path="/institution" element={<InstitutionDashboard />} />
              <Route path="/institution/industry" element={<InstitutionIndustry />} />
              <Route path="/institution/skill-gaps" element={<SkillGapAnalysis />} />
              <Route path="/institution/placements" element={<PlacementTracker />} />
            </Route>

            <Route element={<RoleRoute roles={[ROLES.SUPER_ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add" element={<AddUser />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/audit" element={<AuditLogs />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
