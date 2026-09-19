import { NavLink } from 'react-router-dom'
import {
  Activity,
  Briefcase,
  ClipboardCheck,
  FileText,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Radar,
  Route,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import { ROLES } from '../../utils/constants'

const NAV = {
  [ROLES.STUDENT]: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/twin', label: 'Career Twin', icon: Flame },
    { to: '/student/documents', label: 'Documents', icon: FileText },
    { to: '/student/timeline', label: 'Timeline', icon: Route },
    { to: '/student/gaps', label: 'Skill Gaps', icon: Activity },
    { to: '/student/simulator', label: 'Simulator', icon: Sparkles },
    { to: '/student/learning', label: 'Learning Path', icon: GraduationCap },
    { to: '/student/projects', label: 'Projects', icon: ClipboardCheck },
    { to: '/student/assessments', label: 'Assessments', icon: ClipboardCheck },
    { to: '/student/portfolio', label: 'Portfolio', icon: FileText },
    { to: '/student/internships', label: 'Internships', icon: Briefcase },
    { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: Users },
  ],
  [ROLES.INDUSTRY]: [
    { to: '/industry', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/industry/internships/new', label: 'New Internship', icon: Briefcase },
    { to: '/industry/jobs/new', label: 'New Job', icon: Briefcase },
    { to: '/industry/assignments', label: 'Assignment', icon: ClipboardCheck },
    { to: '/industry/applicants', label: 'Applicants', icon: Users },
    { to: '/industry/radar', label: 'Skill Radar', icon: Radar },
    { to: '/industry/skill-profile', label: 'Role Profile', icon: Flame },
  ],
  [ROLES.ACADEMICIAN]: [
    { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/students', label: 'Students', icon: GraduationCap },
    { to: '/faculty/verification', label: 'Verification', icon: Shield },
    { to: '/faculty/mentorship', label: 'Mentorship', icon: Users },
  ],
  [ROLES.INSTITUTION_ADMIN]: [
    { to: '/institution', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/institution/industry', label: 'Industry', icon: Briefcase },
    { to: '/institution/skill-gaps', label: 'Supply vs Demand', icon: Activity },
    { to: '/institution/placements', label: 'Placements', icon: Briefcase },
  ],
  [ROLES.SUPER_ADMIN]: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/add', label: 'Add', icon: Users },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/audit', label: 'Audit Logs', icon: Shield },
  ],
}

export default function Sidebar({ role, open, onClose }) {
  const items = NAV[role] || []
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-brand-950 text-brand-50 transition lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <Flame className="text-saffron-500" size={22} />
        <div>
          <p className="font-display text-lg leading-none">GapBurn</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-300">Burn the skill gap</p>
        </div>
        <button className="ml-auto text-brand-200 lg:hidden" onClick={onClose}>
          ×
        </button>
      </div>
      <nav className="h-[calc(100%-4rem)] overflow-y-auto px-3 pb-6">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length <= 2}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  isActive ? 'bg-white/10 text-white' : 'text-brand-200 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
