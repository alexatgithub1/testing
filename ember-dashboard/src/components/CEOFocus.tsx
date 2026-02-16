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
    <div className={`bg-card rounded-lg p-6 border-l-4 ${config.borderColor} border border-grid hover:border-opacity-80 transition-all min-h-[120px]`}>
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
  const titleWithEmoji: Record<string, string> = {
    priority: '🎯 TOP PRIORITY',
    upside: '📈 BIGGEST UPSIDE LEVER',
    warning: '⚠️ EARLY WARNING',
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-text-primary mb-6 tracking-tight uppercase">
        CEO Focus This Week
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockData.ceoInsights.map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type as 'priority' | 'upside' | 'warning'}
            title={titleWithEmoji[insight.type] || insight.title}
            message={insight.message}
            action={insight.action}
          />
        ))}
      </div>
      <p className="mt-4 text-text-secondary/70 text-xs">
        Generated {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · Based on data through same period.
      </p>
    </section>
  )
}
