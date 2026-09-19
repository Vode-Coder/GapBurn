import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'

function FunnelTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const current = payload[0].value
  const previous = payload[0].payload.previous
  const conversion = previous ? Math.round((current / previous) * 100) : 100

  return (
    <div className="rounded-xl border border-brand-100 bg-brand-950 px-3 py-2.5 text-xs text-white shadow-xl">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-brand-100">{current} students in stage</p>
      <p className="mt-0.5 text-saffron-300">{conversion}% retained from previous stage</p>
    </div>
  )
}

export default function PlacementProgressChart({ data }) {
  const chartData = data.map((item, index) => ({
    ...item,
    previous: index ? data[index - 1].count : item.count,
  }))

  return (
    <div className="h-80 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-saffron-50 p-2">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 18, right: 18, left: -12, bottom: 4 }}>
          <defs>
            <linearGradient id="placementFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#99f6e4" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#d6e7e2" strokeDasharray="4 5" vertical={false} />
          <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#52605d', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52605d', fontSize: 11 }} />
          <Tooltip content={<FunnelTooltip />} cursor={{ stroke: '#f59e0b', strokeDasharray: '4 4' }} />
          <ReferenceLine y={0} stroke="#c5d6d2" />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0f766e"
            strokeWidth={3}
            fill="url(#placementFill)"
            activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
