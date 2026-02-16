'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockData } from '@/lib/mockData'

export default function MonetizationEconomics() {
  // Gauge: 60% = left, 80% = right. Needle angle in radians (0 = right, π = left).
  const gaugePct = mockData.rewardPayout.current
  const needleAngleRad = ((270 + ((gaugePct - 60) / 20) * 180) * Math.PI) / 180

  return (
    <section>
      <h2 className="text-xl font-semibold text-text-primary mb-6 tracking-tight uppercase">
        Monetization & Economics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Composition */}
        <div className="bg-card rounded-lg p-6 border border-grid lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Revenue Composition (Weekly)
          </h3>

          <div className="mb-4 flex gap-6">
            <div>
              <div className="text-text-secondary text-sm">Ad Revenue</div>
              <div className="text-xl font-bold text-accent-green">
                $412K (49%)
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Game Revenue</div>
              <div className="text-xl font-bold text-warning-yellow">
                $267K (31%)
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Tournament Revenue</div>
              <div className="text-xl font-bold text-accent-green-light">
                $168K (20%)
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.revenueComposition}>
                <XAxis dataKey="week" stroke="#808080" />
                <YAxis stroke="#808080" tickFormatter={(val) => `$${val/1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #1F1F1F' }}
                  formatter={(value: number) => [`$${(value/1000).toFixed(0)}K`, '']}
                />
                <Legend />
                <Bar dataKey="ad" stackId="a" fill="#10B981" name="Ad Revenue" />
                <Bar dataKey="game" stackId="a" fill="#F59E0B" name="Game Revenue" />
                <Bar dataKey="tournament" stackId="a" fill="#6EE7B7" name="Tournament Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-background/50 rounded text-sm text-text-secondary">
            <span className="text-warning-yellow">Insight:</span> Ad revenue still 49% of total. Diversification progress slow.
          </div>
          {[49, 31, 20].some((pct) => pct > 70) && (
            <div className="mt-2 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              Revenue concentration risk
            </div>
          )}
        </div>

        {/* ARPDAU & ARPU */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            ARPDAU & ARPU
          </h3>

          <div className="mb-4 flex gap-6">
            <div>
              <div className="text-text-secondary text-sm">ARPDAU</div>
              <div className="text-2xl font-bold text-accent-green">
                ${mockData.arpdau.current.toFixed(2)}
                <span className="text-sm ml-2 text-accent-green">
                  ↑ ${mockData.arpdau.change.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">ARPU30</div>
              <div className="text-2xl font-bold text-danger-red">
                ${mockData.arpu30.current.toFixed(2)}
                <span className="text-sm ml-2 text-danger-red">
                  ↓ ${Math.abs(mockData.arpu30.change).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.arpdau.trend.map((val, i) => ({
                week: `W${i+1}`,
                arpdau: val,
                arpu30: mockData.arpu30.trend[i]
              }))}>
                <XAxis dataKey="week" stroke="#808080" />
                <YAxis stroke="#808080" tickFormatter={(val) => `$${val.toFixed(2)}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #1F1F1F' }}
                />
                <Legend />
                <Line type="monotone" dataKey="arpdau" stroke="#10B981" strokeWidth={2} name="ARPDAU" />
                <Line type="monotone" dataKey="arpu30" stroke="#6EE7B7" strokeWidth={2} name="ARPU30" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unit Economics */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Unit Economics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-text-secondary text-sm mb-1">BLENDED LTV</div>
              <div className="text-3xl font-bold text-accent-green mb-2">
                ${mockData.unitEconomics.ltv.value.toFixed(2)}
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.unitEconomics.ltv.trend.map((val, i) => ({ value: val }))}>
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="text-text-secondary text-sm mb-1">CAC</div>
              <div className="text-3xl font-bold text-accent-green mb-2">
                ${mockData.unitEconomics.cac.value.toFixed(2)}
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.unitEconomics.cac.trend.map((val, i) => ({ value: val }))}>
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="text-text-secondary text-sm mb-1">LTV:CAC RATIO</div>
              <div className="text-3xl font-bold text-accent-green mb-2">
                {mockData.unitEconomics.ltvCacRatio.value.toFixed(2)}x
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.unitEconomics.ltvCacRatio.trend.map((val, i) => ({ value: val }))}>
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="text-text-secondary text-sm mb-1">PAYBACK</div>
              <div className="text-3xl font-bold text-accent-green mb-2">
                {mockData.unitEconomics.payback.value} days
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.unitEconomics.payback.trend.map((val, i) => ({ value: val }))}>
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {mockData.unitEconomics.ltvCacRatio.value < 2 && (
            <div className="mt-4 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              ⚠️ Unit economics unsustainable - growth vs margin tradeoff
            </div>
          )}
        </div>

        {/* House Edge */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            House Edge & Hold %
          </h3>

          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-accent-green">
              {mockData.houseEdge.current}%
            </div>
            <div className="text-text-secondary text-sm mt-2">
              Target: {mockData.houseEdge.targetMin}%-{mockData.houseEdge.targetMax}%
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.houseEdge.trend.map((val, i) => ({ week: `W${i+1}`, value: val }))}>
                <XAxis dataKey="week" stroke="#808080" />
                <YAxis stroke="#808080" domain={[6, 14]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #1F1F1F' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex justify-between text-xs text-text-secondary">
            <span>Min: {mockData.houseEdge.targetMin}%</span>
            <span>Current: {mockData.houseEdge.current}%</span>
            <span>Max: {mockData.houseEdge.targetMax}%</span>
          </div>
        </div>

        {/* Reward Payout */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Reward Payout Ratio
          </h3>

          <div className="flex justify-center items-center h-48">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Background arc */}
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke="#1F1F1F"
                  strokeWidth="20"
                />
                {/* Safe zone arc */}
                <path
                  d="M 55 130 A 70 70 0 0 1 145 130"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="20"
                  opacity="0.3"
                />
                {/* Needle */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 60 * Math.cos(needleAngleRad)}
                  y2={100 + 60 * Math.sin(needleAngleRad)}
                  stroke="#10B981"
                  strokeWidth="3"
                />
                <circle cx="100" cy="100" r="5" fill="#10B981" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center mt-12">
                  <div className="text-4xl font-bold text-accent-green">
                    {mockData.rewardPayout.current}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-text-secondary mt-4">
            <span>60%</span>
            <span className="text-accent-green">
              Safe zone: {mockData.rewardPayout.targetMin}–{mockData.rewardPayout.targetMax}%
            </span>
            <span>80%</span>
          </div>

          {mockData.rewardPayout.current > 80 && (
            <div className="mt-4 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              Unsustainable payout — check promo abuse
            </div>
          )}
          {mockData.rewardPayout.current < 60 && (
            <div className="mt-4 p-3 bg-warning-yellow/10 border border-warning-yellow rounded text-sm text-warning-yellow">
              Low payout — retention risk
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
