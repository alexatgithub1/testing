'use client'

import { mockData } from '@/lib/mockData'

interface RiskCardProps {
  title: string
  value: string | number
  change?: number
  subtitle?: string
  status: 'good' | 'warning' | 'danger'
}

const statusEmoji: Record<'good' | 'warning' | 'danger', string> = {
  good: '🟢',
  warning: '⚠️',
  danger: '🔴',
}

function RiskCard({ title, value, change, subtitle, status }: RiskCardProps) {
  const statusColors = {
    good: 'border-accent-green',
    warning: 'border-warning-yellow',
    danger: 'border-danger-red',
  }

  return (
    <div className={`bg-card rounded-lg p-6 border-2 ${statusColors[status]} hover:border-opacity-80 transition-all min-h-[220px] flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{statusEmoji[status]}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
          {title}
        </h3>
      </div>

      <div className="text-4xl font-bold text-text-primary mb-2">
        {typeof value === 'number' ? `${value}%` : value}
      </div>

      {change !== undefined && (
        <div className="text-sm text-text-secondary mb-2">
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}pp vs LW
        </div>
      )}

      {subtitle && (
        <div className="text-sm text-text-secondary mt-3 pt-3 border-t border-grid">
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default function RiskLeakage() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-text-primary mb-6 tracking-tight uppercase">
        Risk & Leakage
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <RiskCard
          title="CHURN RISK"
          value={mockData.churn.value}
          change={mockData.churn.change}
          subtitle={`Top reason: ${mockData.churn.topReason}`}
          status={mockData.churn.value > 30 ? 'danger' : mockData.churn.value > 25 ? 'warning' : 'good'}
        />

        <RiskCard
          title="WHALE DEPEND."
          value={mockData.whaleDependency.value}
          change={mockData.whaleDependency.change}
          subtitle="Concentration: High risk"
          status={mockData.whaleDependency.value > 50 ? 'danger' : mockData.whaleDependency.value > 40 ? 'warning' : 'good'}
        />

        <RiskCard
          title="REWARD ABUSE"
          value={mockData.rewardAbuse.value}
          change={mockData.rewardAbuse.change}
          subtitle={`${mockData.rewardAbuse.incidents} incidents this week`}
          status={mockData.rewardAbuse.value > 10 ? 'danger' : mockData.rewardAbuse.value > 5 ? 'warning' : 'good'}
        />

        <RiskCard
          title="PROMO DEPEND."
          value={mockData.promoDependency.value}
          change={mockData.promoDependency.change}
          subtitle={`Organic DAU: ${mockData.promoDependency.organicDau.toLocaleString()} (36%)`}
          status={mockData.promoDependency.value > 60 ? 'danger' : mockData.promoDependency.value > 40 ? 'warning' : 'good'}
        />

        <RiskCard
          title="PLATFORM RISK"
          value={mockData.platformRisk.appStoreStatus}
          subtitle={`High-risk geos: ${mockData.platformRisk.highRiskGeoRevenue}% of revenue`}
          status="warning"
        />
      </div>

      <div className="mt-6 p-4 bg-background/30 border border-grid rounded-lg">
        <div className="text-text-secondary text-sm">
          <span className="text-danger-red font-semibold">⚠️ Critical Attention:</span>{' '}
          Promo dependency at {mockData.promoDependency.value}% - unsustainable growth pattern.
          Review organic acquisition channels and reduce promo intensity.
        </div>
      </div>
    </section>
  )
}
