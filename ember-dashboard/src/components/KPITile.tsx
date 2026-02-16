'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export type ThresholdStatus = 'good' | 'warning' | 'danger'

interface KPITileProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  sparkline?: number[]
  subtitle?: string
  format?: 'number' | 'currency' | 'percent'
  /** When set, tile border and change color use threshold (e.g. margin above target = good). Otherwise up=green, down=red. */
  thresholdStatus?: ThresholdStatus
  /** Optional tooltip / definition for the metric */
  tooltip?: string
}

const thresholdBorder: Record<ThresholdStatus, string> = {
  good: 'border-l-accent-green',
  warning: 'border-l-warning-yellow',
  danger: 'border-l-danger-red',
}

const thresholdChangeColor: Record<ThresholdStatus, string> = {
  good: 'text-accent-green',
  warning: 'text-warning-yellow',
  danger: 'text-danger-red',
}

export default function KPITile({
  label,
  value,
  change,
  changeLabel,
  sparkline,
  subtitle,
  format = 'number',
  thresholdStatus,
  tooltip,
}: KPITileProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const changeColor = thresholdStatus
    ? thresholdChangeColor[thresholdStatus]
    : isPositive
      ? 'text-accent-green'
      : isNegative
        ? 'text-danger-red'
        : 'text-text-secondary'

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    if (format === 'currency') return `$${val.toLocaleString()}`
    if (format === 'percent') return `${val}%`
    return val.toLocaleString()
  }

  return (
    <div
      className={`bg-card rounded-lg p-4 sm:p-6 border border-grid hover:border-accent-green/30 transition-all min-w-0 min-h-[160px] sm:min-h-[180px] flex flex-col border-l-4 ${thresholdStatus ? thresholdBorder[thresholdStatus] : 'border-l-[#1F1F1F]'}`}
      title={tooltip}
    >
      <div className="text-text-secondary text-sm font-medium mb-1 sm:mb-2 flex items-center gap-1">
        {label}
        {tooltip && <span className="text-text-secondary/70 cursor-help" title={tooltip}>ⓘ</span>}
      </div>

      <div className="text-3xl sm:text-[48px] leading-tight font-bold mb-1 sm:mb-2 text-text-primary">
        {formatValue(value)}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {!thresholdStatus && isPositive && <ArrowUp className="w-4 h-4 text-accent-green shrink-0" />}
          {!thresholdStatus && isNegative && <ArrowDown className="w-4 h-4 text-danger-red shrink-0" />}
          {thresholdStatus && isPositive && <ArrowUp className={`w-4 h-4 shrink-0 ${thresholdChangeColor[thresholdStatus]}`} />}
          {thresholdStatus && isNegative && <ArrowDown className={`w-4 h-4 shrink-0 ${thresholdChangeColor[thresholdStatus]}`} />}
          <span className={`text-sm font-medium ${changeColor}`}>
            {Math.abs(change)}% {changeLabel || 'vs LW'}
          </span>
        </div>
      )}

      {subtitle && (
        <div className="text-text-secondary text-sm">{subtitle}</div>
      )}

      {sparkline && sparkline.length > 0 && mounted && (
        <div className="mt-3 h-12 w-full min-h-[48px]">
          <ResponsiveContainer width="100%" height={48}>
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
