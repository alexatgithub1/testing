'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, ChevronDown, GripVertical } from 'lucide-react'

const OWNERS = ['Alex', 'Guillaume', 'Hayden/T', 'Mario', 'Trishul']
const FIB_VALUES = [1, 2, 3, 5, 8, 13, 21]

interface Initiative {
  id: string
  initiative: string
  difficulty: number
  impact: number
  revenueGrowth: boolean
  marginExpansion: boolean
  operations: boolean
  compliance: boolean
  aiStrategic: boolean
  notes: string
  owner: string
}

const INITIAL_DATA: Initiative[] = [
  {
    id: '1',
    initiative: 'Increase house edge on games',
    difficulty: 1,
    impact: 9,
    revenueGrowth: true,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Direct, repeatable EBITDA lever',
    owner: 'Mario',
  },
  {
    id: '2',
    initiative: 'A/B test loosening withdrawal requirements',
    difficulty: 1,
    impact: 8,
    revenueGrowth: true,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Fastest signal on abuse vs retention',
    owner: 'Guillaume',
  },
  {
    id: '3',
    initiative: 'Kill mining extractors cohort',
    difficulty: 2,
    impact: 8,
    revenueGrowth: false,
    marginExpansion: true,
    operations: true,
    compliance: false,
    aiStrategic: false,
    notes: 'Margin + system integrity',
    owner: 'Guillaume',
  },
  {
    id: '4',
    initiative: 'Gamification / Retention (buttoning up rewards, rakeback, UX, etc)',
    difficulty: 5,
    impact: 10,
    revenueGrowth: false,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: true,
    notes: 'North Star Metric',
    owner: 'Hayden/T',
  },
  {
    id: '5',
    initiative: 'God Mode playthrough feature',
    difficulty: 3,
    impact: 8,
    revenueGrowth: true,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Improves LTV + reward recycling',
    owner: 'Guillaume',
  },
  {
    id: '6',
    initiative: 'Revenue Based Financing / Other Financing',
    difficulty: 3,
    impact: 8,
    revenueGrowth: true,
    marginExpansion: false,
    operations: true,
    compliance: false,
    aiStrategic: false,
    notes: 'Facilitate aggressive revenue targets',
    owner: 'Alex',
  },
  {
    id: '7',
    initiative: 'International expansion + Localization',
    difficulty: 5,
    impact: 10,
    revenueGrowth: true,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: true,
    notes: 'Start with 2-4 countries',
    owner: 'Trishul',
  },
  {
    id: '8',
    initiative: 'Remove blacklisted states / countries',
    difficulty: 2,
    impact: 6,
    revenueGrowth: false,
    marginExpansion: false,
    operations: false,
    compliance: true,
    aiStrategic: false,
    notes: 'Compliance + platform optics',
    owner: 'Hayden/T',
  },
  {
    id: '9',
    initiative: 'Expand new growth initiatives (Affiliate, Clipping)',
    difficulty: 3,
    impact: 7,
    revenueGrowth: true,
    marginExpansion: false,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Diversify UA risk',
    owner: 'Alex',
  },
  {
    id: '10',
    initiative: 'Secure relationship with Facebook advertising',
    difficulty: 5,
    impact: 8,
    revenueGrowth: true,
    marginExpansion: false,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Hedge UA platform risk',
    owner: 'Alex',
  },
  {
    id: '11',
    initiative: 'Migrate to Breeze to increase margin',
    difficulty: 3,
    impact: 8,
    revenueGrowth: true,
    marginExpansion: true,
    operations: false,
    compliance: false,
    aiStrategic: false,
    notes: 'Structural margin expansion',
    owner: 'Mario',
  },
  {
    id: '12',
    initiative: 'Secure relationship with Apple & Google internal teams',
    difficulty: 8,
    impact: 10,
    revenueGrowth: false,
    marginExpansion: false,
    operations: false,
    compliance: true,
    aiStrategic: false,
    notes: 'Platform-level risk reducer',
    owner: 'Alex',
  },
]

function ScoreBadge({ score }: { score: number }) {
  let color = 'text-danger-red bg-danger-red/10'
  if (score >= 6) color = 'text-accent-green bg-accent-green/10'
  else if (score >= 4) color = 'text-warning-yellow bg-warning-yellow/10'

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md font-bold text-sm ${color}`}>
      {score}
    </span>
  )
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
        checked
          ? 'bg-accent-green border-accent-green'
          : 'border-grid hover:border-text-secondary'
      }`}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function OwnerDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-grid hover:border-text-secondary transition-all text-sm text-text-primary bg-card min-w-[100px] justify-between"
      >
        <span>{value || 'Select'}</span>
        <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-grid rounded-lg shadow-xl overflow-hidden min-w-[120px]">
            {OWNERS.map((owner) => (
              <button
                key={owner}
                onClick={() => { onChange(owner); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-grid ${
                  value === owner ? 'text-accent-green bg-accent-green/5' : 'text-text-primary'
                }`}
              >
                {owner}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FibDropdown({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-grid hover:border-text-secondary transition-all text-sm text-text-primary bg-card w-14 justify-between"
      >
        <span>{value}</span>
        <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-grid rounded-lg shadow-xl overflow-hidden min-w-[56px]">
            {FIB_VALUES.map((fib) => (
              <button
                key={fib}
                onClick={() => { onChange(fib); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-grid ${
                  value === fib ? 'text-accent-green bg-accent-green/5' : 'text-text-primary'
                }`}
              >
                {fib}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ImpactDropdown({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-grid hover:border-text-secondary transition-all text-sm text-text-primary bg-card w-14 justify-between"
      >
        <span>{value}</span>
        <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-grid rounded-lg shadow-xl overflow-hidden min-w-[56px] max-h-[200px] overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                onClick={() => { onChange(val); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-grid ${
                  value === val ? 'text-accent-green bg-accent-green/5' : 'text-text-primary'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function PrioritiesPage() {
  const [items, setItems] = useState<Initiative[]>(INITIAL_DATA)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (b.impact - b.difficulty) - (a.impact - a.difficulty))
  }, [items])

  const updateItem = useCallback((id: string, updates: Partial<Initiative>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }, [])

  const addItem = useCallback(() => {
    const newId = String(Date.now())
    setItems(prev => [...prev, {
      id: newId,
      initiative: '',
      difficulty: 1,
      impact: 5,
      revenueGrowth: false,
      marginExpansion: false,
      operations: false,
      compliance: false,
      aiStrategic: false,
      notes: '',
      owner: '',
    }])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-green transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Global <span className="text-accent-green">Priorities</span>
            </h1>
            <p className="text-text-secondary">
              Ranked by Total Score (Impact − Difficulty) • {items.length} initiatives
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={addItem}
              className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-accent-green text-background hover:bg-accent-green-light"
            >
              <Plus className="w-4 h-4" />
              Add Initiative
            </button>
            <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="max-w-[1800px] mx-auto">
        <div className="border border-grid rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-card border-b border-grid">
            <div className="grid grid-cols-[48px_48px_1fr_80px_80px_80px_80px_80px_80px_80px_80px_1fr_120px_48px] items-center gap-0">
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider" />
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">#</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Initiative</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Diff<br />(Fib)</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Impact<br />(1–10)</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Score</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Rev<br />Growth</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Margin<br />Exp.</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Ops</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Comp.</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">AI /<br />Strat.</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Notes</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Owner</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider" />
            </div>
          </div>

          {/* Table Body */}
          <div>
            {sorted.map((item, index) => {
              const score = item.impact - item.difficulty
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[48px_48px_1fr_80px_80px_80px_80px_80px_80px_80px_80px_1fr_120px_48px] items-center gap-0 border-b border-grid last:border-b-0 hover:bg-card/50 transition-colors group"
                >
                  {/* Grip */}
                  <div className="px-3 py-3 flex justify-center">
                    <GripVertical className="w-4 h-4 text-grid group-hover:text-text-secondary transition-colors" />
                  </div>

                  {/* Rank */}
                  <div className="px-3 py-3 text-center">
                    <span className="text-text-secondary font-mono text-sm">{index + 1}</span>
                  </div>

                  {/* Initiative Name */}
                  <div className="px-3 py-3">
                    <input
                      type="text"
                      value={item.initiative}
                      onChange={(e) => updateItem(item.id, { initiative: e.target.value })}
                      className="w-full bg-transparent text-text-primary text-sm border-0 outline-none focus:ring-0 placeholder-text-secondary/50 hover:bg-grid/50 focus:bg-grid/50 rounded px-1 py-0.5 -ml-1 transition-colors"
                      placeholder="Enter initiative name..."
                    />
                  </div>

                  {/* Difficulty (Fibonacci) */}
                  <div className="px-3 py-3 flex justify-center">
                    <FibDropdown
                      value={item.difficulty}
                      onChange={(v) => updateItem(item.id, { difficulty: v })}
                    />
                  </div>

                  {/* Impact */}
                  <div className="px-3 py-3 flex justify-center">
                    <ImpactDropdown
                      value={item.impact}
                      onChange={(v) => updateItem(item.id, { impact: v })}
                    />
                  </div>

                  {/* Total Score */}
                  <div className="px-3 py-3 flex justify-center">
                    <ScoreBadge score={score} />
                  </div>

                  {/* Revenue Growth */}
                  <div className="px-3 py-3 flex justify-center">
                    <Checkbox checked={item.revenueGrowth} onChange={(v) => updateItem(item.id, { revenueGrowth: v })} />
                  </div>

                  {/* Margin Expansion */}
                  <div className="px-3 py-3 flex justify-center">
                    <Checkbox checked={item.marginExpansion} onChange={(v) => updateItem(item.id, { marginExpansion: v })} />
                  </div>

                  {/* Operations */}
                  <div className="px-3 py-3 flex justify-center">
                    <Checkbox checked={item.operations} onChange={(v) => updateItem(item.id, { operations: v })} />
                  </div>

                  {/* Compliance */}
                  <div className="px-3 py-3 flex justify-center">
                    <Checkbox checked={item.compliance} onChange={(v) => updateItem(item.id, { compliance: v })} />
                  </div>

                  {/* AI / Strategic */}
                  <div className="px-3 py-3 flex justify-center">
                    <Checkbox checked={item.aiStrategic} onChange={(v) => updateItem(item.id, { aiStrategic: v })} />
                  </div>

                  {/* Notes */}
                  <div className="px-3 py-3">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                      className="w-full bg-transparent text-text-secondary text-sm border-0 outline-none focus:ring-0 placeholder-text-secondary/50 hover:bg-grid/50 focus:bg-grid/50 rounded px-1 py-0.5 -ml-1 transition-colors"
                      placeholder="Add notes..."
                    />
                  </div>

                  {/* Owner */}
                  <div className="px-3 py-3">
                    <OwnerDropdown
                      value={item.owner}
                      onChange={(v) => updateItem(item.id, { owner: v })}
                    />
                  </div>

                  {/* Delete */}
                  <div className="px-3 py-3 flex justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-danger-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="mt-6 flex items-center gap-8 text-sm text-text-secondary">
          <div>
            <span className="text-text-primary font-semibold">{items.length}</span> initiatives
          </div>
          <div>
            Avg Score: <span className="text-accent-green font-semibold">
              {items.length > 0 ? (items.reduce((sum, i) => sum + (i.impact - i.difficulty), 0) / items.length).toFixed(1) : '0'}
            </span>
          </div>
          <div>
            Owners: <span className="text-text-primary font-semibold">
              {new Set(items.map(i => i.owner).filter(Boolean)).size}
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-grid text-center text-text-secondary text-sm">
        <p>Ember Global Priorities v1.0 • Built with Next.js</p>
      </footer>
    </div>
  )
}
