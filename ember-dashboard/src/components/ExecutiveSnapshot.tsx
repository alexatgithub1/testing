'use client'

import KPITile, { type ThresholdStatus } from './KPITile'
import { mockData } from '@/lib/mockData'

function thresholdFromChange(change: number, goodMin: number, warningMin: number): ThresholdStatus {
  if (change >= goodMin) return 'good'
  if (change >= warningMin) return 'warning'
  return 'danger'
}

export default function ExecutiveSnapshot() {
  const revenueThreshold = thresholdFromChange(mockData.revenue.change, 10, 5)
  const marginThreshold: ThresholdStatus =
    mockData.grossMargin.value >= 65 ? 'good' : mockData.grossMargin.value >= 60 ? 'warning' : 'danger'
  const dauThreshold = thresholdFromChange(mockData.dau.change, 2, 0)
  const mauThreshold = thresholdFromChange(mockData.mau.change, 5, 3)
  const wagerThreshold = thresholdFromChange(mockData.wagerVolume.change, 10, 5)
  const ggrThreshold = thresholdFromChange(mockData.ggr.change, 10, 5)

  return (
    <section>
      <h2 className="text-xl font-semibold text-text-primary mb-6 tracking-tight uppercase">
        Executive Snapshot
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPITile
          label="NET REVENUE (MTD)"
          value={`$${(mockData.revenue.mtd / 1000).toFixed(0)}K`}
          change={mockData.revenue.change}
          changeLabel="vs LM"
          subtitle={`On pace: $${(mockData.revenue.projected / 1000000).toFixed(2)}M`}
          format="currency"
          thresholdStatus={revenueThreshold}
          tooltip="Net revenue after payouts and deductions (MTD)."
        />

        <KPITile
          label="GROSS MARGIN"
          value={`${mockData.grossMargin.value}%`}
          change={mockData.grossMargin.change}
          changeLabel="vs LM"
          subtitle={`COGS: $${(mockData.grossMargin.cogs / 1000).toFixed(0)}K`}
          format="percent"
          thresholdStatus={marginThreshold}
        />

        <KPITile
          label="DAU"
          value={mockData.dau.value}
          change={mockData.dau.change}
          changeLabel="vs LW"
          sparkline={mockData.dau.sparkline}
          thresholdStatus={dauThreshold}
        />

        <KPITile
          label="MAU"
          value={`${(mockData.mau.value / 1000000).toFixed(2)}M`}
          change={mockData.mau.change}
          changeLabel="vs LM"
          sparkline={mockData.mau.sparkline}
          thresholdStatus={mauThreshold}
        />

        <KPITile
          label="WAGER VOLUME"
          value={`$${mockData.wagerVolume.value}M`}
          change={mockData.wagerVolume.change}
          changeLabel="vs LM"
          sparkline={mockData.wagerVolume.sparkline}
          subtitle={mockData.wagerVolume.label}
          thresholdStatus={wagerThreshold}
        />

        <KPITile
          label="GGR"
          value={`$${(mockData.ggr.value / 1000).toFixed(0)}K`}
          change={mockData.ggr.change}
          changeLabel="vs LM"
          sparkline={mockData.ggr.sparkline}
          thresholdStatus={ggrThreshold}
          subtitle="Gross gaming revenue"
          tooltip="Gross gaming revenue: total wagers minus payouts (house win)."
        />
      </div>
    </section>
  )
}
