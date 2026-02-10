'use client'

import { Target, TrendingUp, AlertTriangle } from 'lucide-react'
import { mockData } from '@/lib/mockData'

interface InsightCardProps {
  type: 'priority' | 'upside' | 'warning'
  title: string
  message: string
  action: string
}

function InsightCard({ type, title, message, action }: InsightCardProps) {
  const typeConfig = {
    priority: {
      icon: <Target className="w-6 h-6" />,
      borderColor: 'border-l-danger-red',
      iconColor: 'text-danger-red',
    },
    upside: {
      icon: <TrendingUp className="w-6 h-6" />,
      borderColor: 'border-l-accent-green',
      iconColor: 'text-accent-green',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      borderColor: 'border-l-warning-yellow',
      iconColor: 'text-warning-yellow',
    },
  }

  const config = typeConfig[type]

  return (
    <div className={`bg-card rounded-lg p-6 border-l-4 ${config.borderColor} border border-grid hover:shadow-lg transition-all`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={config.iconColor}>{config.icon}</div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>

      <p className="text-text-secondary mb-4 leading-relaxed">
        {message}
      </p>

      <div className="text-accent-green font-medium">
        {action}
      </div>
    </div>
  )
}

export default function CEOFocus() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-text-primary">
        CEO Focus This Week
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockData.ceoInsights.map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type as 'priority' | 'upside' | 'warning'}
            title={insight.title}
            message={insight.message}
            action={insight.action}
          />
        ))}
      </div>
    </section>
  )
}
