import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export default function SkillRadarChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
          <Radar name="Student" dataKey="student" stroke="#0f766e" fill="#14b8a6" fillOpacity={0.35} />
          <Radar name="Required" dataKey="required" stroke="#d97706" fill="#f59e0b" fillOpacity={0.15} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
