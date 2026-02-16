'use client'

import { useState, useCallback } from 'react'
import ExecutiveSnapshot from '@/components/ExecutiveSnapshot'
import GrowthQuality from '@/components/GrowthQuality'
import MonetizationEconomics from '@/components/MonetizationEconomics'
import RiskLeakage from '@/components/RiskLeakage'
import CEOFocus from '@/components/CEOFocus'
import FileUpload from '@/components/FileUpload'
import { Database, Upload as UploadIcon, ListOrdered, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { mockData } from '@/lib/mockData'

const DATA_AS_OF = new Date()

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false)
  const [hasUploadedData, setHasUploadedData] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDataAnalyzed = (data: any) => {
    console.log('Data analyzed:', data)
    setHasUploadedData(true)
    setShowUpload(false)
  }

  const copySummary = useCallback(() => {
    try {
      const r = mockData.revenue
      const gm = mockData.grossMargin
      const dau = mockData.dau
      const mau = mockData.mau
      const wv = mockData.wagerVolume
      const ggr = mockData.ggr
      const lines = [
        'Ember CEO Dashboard — Executive Snapshot',
        `Data as of: ${DATA_AS_OF.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`,
        '',
        `Net Revenue (MTD): $${(r.mtd / 1000).toFixed(0)}K (${r.change}% vs LM)`,
        `Gross Margin: ${gm.value}% (${gm.change}% vs LM)`,
        `DAU: ${dau.value.toLocaleString()} (${dau.change}% vs LW)`,
        `MAU: ${(mau.value / 1_000_000).toFixed(2)}M (${mau.change}% vs LM)`,
        `Wager Volume: $${wv.value}M ${wv.label} (${wv.change}% vs LM)`,
        `GGR: $${(ggr.value / 1000).toFixed(0)}K (${ggr.change}% vs LM)`,
      ]
      const text = lines.join('\n')
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }).catch(() => {})
      }
    } catch (_) { /* ignore */ }
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Header — minimal, black canvas */}
      <header className="mb-6 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Ember <span className="text-accent-green">CEO Dashboard</span>
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Executive Decision Cockpit
          </p>
          <p className="text-text-secondary/80 text-xs mt-0.5">
            Data as of {DATA_AS_OF.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {hasUploadedData && (
            <span className="px-2.5 py-1 bg-accent-green/20 rounded text-xs text-accent-green flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              Uploaded data
            </span>
          )}
          <button
            onClick={copySummary}
            className="text-sm px-3 py-1.5 rounded border border-grid text-text-secondary hover:border-accent-green hover:text-accent-green transition-colors flex items-center gap-2"
            title="Copy key metrics to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <Link
            href="/priorities"
            className="text-sm text-text-secondary hover:text-accent-green transition-colors flex items-center gap-2"
          >
            <ListOrdered className="w-4 h-4" />
            Priorities
          </Link>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`text-sm px-3 py-1.5 rounded border transition-colors flex items-center gap-2 ${showUpload ? 'border-grid text-text-secondary' : 'border-accent-green text-accent-green hover:bg-accent-green/10'}`}
          >
            <UploadIcon className="w-4 h-4" />
            {showUpload ? 'Hide' : 'Upload'}
          </button>
          <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" title="Live" />
        </div>
      </header>

      {/* Dashboard Sections — 32px section spacing */}
      <main className="max-w-[1800px] mx-auto space-y-6 sm:space-y-8">
        {showUpload && <FileUpload onDataAnalyzed={handleDataAnalyzed} />}

        <ExecutiveSnapshot />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GrowthQuality />
          <MonetizationEconomics />
        </div>

        <RiskLeakage />

        <CEOFocus />
      </main>

      <footer className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-grid text-center text-text-secondary text-xs">
        Ember CEO Dashboard · Decision instrument, not a reporting tool.
      </footer>
    </div>
  )
}
