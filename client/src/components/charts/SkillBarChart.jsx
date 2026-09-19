import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function SkillBarChart({ data, xKey = 'name', yKey = 'value' }) {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} interval={0} angle={-18} height={70} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill="#0f766e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
