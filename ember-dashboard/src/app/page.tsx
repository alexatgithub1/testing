'use client'

import { useState } from 'react'
import ExecutiveSnapshot from '@/components/ExecutiveSnapshot'
import GrowthQuality from '@/components/GrowthQuality'
import MonetizationEconomics from '@/components/MonetizationEconomics'
import RiskLeakage from '@/components/RiskLeakage'
import CEOFocus from '@/components/CEOFocus'
import FileUpload from '@/components/FileUpload'
import { Database, Upload as UploadIcon, ListOrdered } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false)
  const [hasUploadedData, setHasUploadedData] = useState(false)

  const handleDataAnalyzed = (data: any) => {
    console.log('Data analyzed:', data)
    setHasUploadedData(true)
    setShowUpload(false)
    // Here you could update a global state or context with the analyzed data
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Ember <span className="text-accent-green">CEO Dashboard</span>
            </h1>
            <p className="text-text-secondary">
              Executive Decision Cockpit • Updated {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {hasUploadedData && (
              <div className="px-3 py-1 bg-accent-green/20 rounded-full text-xs text-accent-green flex items-center gap-2">
                <Database className="w-3 h-3" />
                Using uploaded data
              </div>
            )}

            <Link
              href="/priorities"
              className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border border-grid text-text-secondary hover:border-accent-green hover:text-accent-green"
            >
              <ListOrdered className="w-4 h-4" />
              Priorities
            </Link>

            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${showUpload
                  ? 'bg-grid text-text-secondary'
                  : 'bg-accent-green text-background hover:bg-accent-green-light'
                }
              `}
            >
              <UploadIcon className="w-4 h-4" />
              {showUpload ? 'Hide Upload' : 'Upload Data'}
            </button>

            <div className="text-right">
              <div className="text-text-secondary text-sm">Week of</div>
              <div className="text-text-primary font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Dashboard Sections */}
      <main className="max-w-[1800px] mx-auto space-y-8">
        {/* File Upload Section */}
        {showUpload && (
          <FileUpload onDataAnalyzed={handleDataAnalyzed} />
        )}

        <ExecutiveSnapshot />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GrowthQuality />
          <MonetizationEconomics />
        </div>

        <RiskLeakage />

        <CEOFocus />
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-grid text-center text-text-secondary text-sm">
        <p>Ember CEO Dashboard v1.0 • Built with Next.js & Recharts</p>
        <p className="mt-2">This is a decision instrument, not a reporting tool.</p>
      </footer>
    </div>
  )
}
