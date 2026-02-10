'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface KPITileProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  sparkline?: number[]
  subtitle?: string
  format?: 'number' | 'currency' | 'percent'
}

export default function KPITile({
  label,
  value,
  change,
  changeLabel,
  sparkline,
  subtitle,
  format = 'number',
}: KPITileProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    if (format === 'currency') return `$${val.toLocaleString()}`
    if (format === 'percent') return `${val}%`
    return val.toLocaleString()
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-grid hover:border-accent-green/30 transition-all">
      <div className="text-text-secondary text-sm font-medium mb-2">{label}</div>

      <div className="text-5xl font-bold mb-3 text-text-primary">
        {formatValue(value)}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          {isPositive && <ArrowUp className="w-4 h-4 text-accent-green" />}
          {isNegative && <ArrowDown className="w-4 h-4 text-danger-red" />}
          <span className={`text-sm font-medium ${isPositive ? 'text-accent-green' : isNegative ? 'text-danger-red' : 'text-text-secondary'}`}>
            {Math.abs(change)}% {changeLabel || 'vs LW'}
          </span>
        </div>
      )}

      {subtitle && (
        <div className="text-text-secondary text-sm">{subtitle}</div>
      )}

      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline.map((val, i) => ({ value: val, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
