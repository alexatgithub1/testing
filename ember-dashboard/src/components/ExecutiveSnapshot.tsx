'use client'

import KPITile from './KPITile'
import { mockData } from '@/lib/mockData'

export default function ExecutiveSnapshot() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-text-primary">
        Executive Snapshot
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPITile
          label="DAU"
          value={mockData.dau.value}
          change={mockData.dau.change}
          changeLabel="vs LW"
          sparkline={mockData.dau.sparkline}
        />

        <KPITile
          label="MAU"
          value={`${(mockData.mau.value / 1000000).toFixed(2)}M`}
          change={mockData.mau.change}
          changeLabel="vs LM"
          sparkline={mockData.mau.sparkline}
        />

        <KPITile
          label="STICKINESS"
          value={`${mockData.stickiness.value}%`}
          change={mockData.stickiness.change}
          changeLabel="vs LW"
          subtitle={`Target: ${mockData.stickiness.target}%`}
        />

        <KPITile
          label="NET REVENUE (MTD)"
          value={`$${(mockData.revenue.mtd / 1000).toFixed(0)}K`}
          change={mockData.revenue.change}
          changeLabel="vs LM"
          subtitle={`On pace: $${(mockData.revenue.projected / 1000000).toFixed(2)}M`}
          format="currency"
        />

        <KPITile
          label="GROSS MARGIN"
          value={`${mockData.grossMargin.value}%`}
          change={mockData.grossMargin.change}
          changeLabel="vs LM"
          subtitle={`COGS: $${(mockData.grossMargin.cogs / 1000).toFixed(0)}K`}
          format="percent"
        />

        <KPITile
          label="CASH POSITION"
          value={`${mockData.cash.runway}M runway`}
          subtitle={`-$${Math.abs(mockData.cash.weeklyBurn / 1000).toFixed(0)}K burn (LW)`}
        />
      </div>
    </section>
  )
}
