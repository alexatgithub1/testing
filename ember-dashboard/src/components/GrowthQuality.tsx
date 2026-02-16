'use client'

import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockData } from '@/lib/mockData'

export default function GrowthQuality() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-text-primary mb-6 tracking-tight uppercase">
        Growth Quality
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New User Acquisition */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            New User Acquisition
          </h3>

          <div className="mb-4 flex flex-wrap gap-6">
            <div>
              <div className="text-text-secondary text-sm">Total new users this week</div>
              <div className="text-2xl font-bold text-accent-green">
                {mockData.newUsers.total.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Organic %</div>
              <div className="text-2xl font-bold text-accent-green">
                {mockData.newUsers.organicPct}% <span className="text-sm ml-1">↑ {mockData.newUsers.organicChange}pp vs LW</span>
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Paid % (target: &lt;60%)</div>
              <div className="text-2xl font-bold text-text-primary">{mockData.newUsers.paidPct}%</div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Referral % (target: &gt;20%)</div>
              <div className="text-2xl font-bold text-text-primary">{mockData.newUsers.referralPct}%</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.newUsers.breakdown}>
                <defs>
                  <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="paidBranded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="paidUAC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="referral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#808080" />
                <YAxis stroke="#808080" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #1F1F1F' }}
                />
                <Legend />
                <Area type="monotone" dataKey="organic" stackId="1" stroke="#10B981" fill="url(#organic)" name="Organic" />
                <Area type="monotone" dataKey="paidBranded" stackId="1" stroke="#F59E0B" fill="url(#paidBranded)" name="Paid (Branded)" />
                <Area type="monotone" dataKey="paidUAC" stackId="1" stroke="#D97706" fill="url(#paidUAC)" name="Paid (UAC)" />
                <Area type="monotone" dataKey="referral" stackId="1" stroke="#6EE7B7" fill="url(#referral)" name="Referral" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-background/50 rounded text-sm text-text-secondary">
            <span className="text-accent-green">Insight:</span> Organic mix improving. Still {mockData.newUsers.paidPct}% paid-dependent.
          </div>
          {mockData.newUsers.paidPct > 70 && (
            <div className="mt-2 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              Growth heavily paid-dependent
            </div>
          )}
        </div>

        {/* Retention Curves */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Retention Curves
          </h3>

          <div className="mb-4 flex flex-wrap gap-6">
            <div>
              <div className="text-text-secondary text-sm">D7 Retention</div>
              <div className="text-2xl font-bold text-accent-green">
                {mockData.retention.d7}% <span className="text-sm ml-1 text-accent-green">↑ {mockData.retention.d7Change}pp vs LW</span>
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">D30 Retention</div>
              <div className="text-2xl font-bold text-danger-red">
                {mockData.retention.d30}% <span className="text-sm ml-1 text-danger-red">↓ {Math.abs(mockData.retention.d30Change)}pp vs LW</span>
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm">Unbounded D7 (context)</div>
              <div className="text-xl font-bold text-text-primary">{mockData.retention.unboundedD7}%</div>
            </div>
          </div>

          {mockData.retention.d7 < 20 && (
            <div className="mb-4 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              Retention crisis — investigate onboarding
            </div>
          )}

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.retention.curves}>
                <XAxis dataKey="day" stroke="#808080" />
                <YAxis stroke="#808080" unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #1F1F1F' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Current week"
                />
                <Line
                  type="monotone"
                  dataKey="prior"
                  stroke="#6EE7B7"
                  strokeWidth={2}
                  name="Prior week"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="fourWeeksAgo"
                  stroke="#808080"
                  strokeWidth={2}
                  name="4 weeks ago"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* K-Factor */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            K-Factor / Viral Coefficient
          </h3>

          <div className="text-center">
            <div className="text-6xl font-bold text-warning-yellow mb-3">
              {mockData.kFactor.value}
            </div>
            <div className="text-text-secondary text-sm mb-4">
              Target: {mockData.kFactor.target}
            </div>

            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.kFactor.trend.map((val, i) => ({ value: val, week: `W${i+1}` }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activation Funnel */}
        <div className="bg-card rounded-lg p-6 border border-grid">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Activation Funnel
          </h3>

          <div className="space-y-4">
            {[
              { label: 'Install', ...mockData.activation.install },
              { label: 'Sign Up', ...mockData.activation.signUp },
              { label: 'First Deposit', ...mockData.activation.firstDeposit },
              { label: 'First Withdrawal', ...mockData.activation.firstWithdrawal },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">{step.label}</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {step.pct}% <span className="text-text-secondary ml-1">({step.value.toLocaleString()})</span>
                  </span>
                </div>
                <div className="h-8 bg-background/50 rounded overflow-hidden">
                  <div
                    className={`h-full ${step.label === 'First Deposit' ? 'bg-accent-green' : 'bg-grid'} transition-all`}
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {(mockData.activation.firstDeposit.pct < 15) && (
            <div className="mt-4 p-3 bg-danger-red/10 border border-danger-red rounded text-sm text-danger-red">
              Activation funnel broken — check onboarding flow
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
