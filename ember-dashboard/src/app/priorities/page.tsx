'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, ArrowUpDown, Hand, Cloud, CloudOff, Loader2, Link2, X } from 'lucide-react'

const OWNERS = ['Alex', 'Guillaume', 'Hayden', 'Mario', 'Trishul']
const FIB_VALUES = [1, 2, 3, 5, 8, 13, 21]
const STORAGE_KEY = 'ember-priorities'
const SHEETS_URL_KEY = 'ember-sheets-url'

type Status = 'not_started' | 'in_progress' | 'blocked' | 'done'

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-text-secondary', bg: 'bg-grid' },
  in_progress: { label: 'In Progress', color: 'text-accent-green', bg: 'bg-accent-green/10' },
  blocked: { label: 'Blocked', color: 'text-danger-red', bg: 'bg-danger-red/10' },
  done: { label: 'Done', color: 'text-accent-green-light', bg: 'bg-accent-green/5' },
}

type TagKey = 'revenueGrowth' | 'marginExpansion' | 'operations' | 'compliance' | 'aiStrategic'

const TAG_CONFIG: Record<TagKey, { label: string; activeClass: string; inactiveClass: string }> = {
  revenueGrowth: {
    label: 'Revenue',
    activeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    inactiveClass: 'bg-transparent text-text-secondary/30 border-grid/50',
  },
  marginExpansion: {
    label: 'Margin',
    activeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    inactiveClass: 'bg-transparent text-text-secondary/30 border-grid/50',
  },
  operations: {
    label: 'Ops',
    activeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    inactiveClass: 'bg-transparent text-text-secondary/30 border-grid/50',
  },
  compliance: {
    label: 'Comp',
    activeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    inactiveClass: 'bg-transparent text-text-secondary/30 border-grid/50',
  },
  aiStrategic: {
    label: 'AI/Strat',
    activeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    inactiveClass: 'bg-transparent text-text-secondary/30 border-grid/50',
  },
}
const TAG_KEYS = Object.keys(TAG_CONFIG) as TagKey[]

interface Initiative {
  id: string
  initiative: string
  difficulty: number
  impact: number
  status: Status
  revenueGrowth: boolean
  marginExpansion: boolean
  operations: boolean
  compliance: boolean
  aiStrategic: boolean
  notes: string
  owner: string
}

type SortKey = 'score' | 'difficulty' | 'impact' | 'status' | 'owner' | 'initiative' | null

const INITIAL_DATA: Initiative[] = [
  { id: '1', initiative: 'Increase house edge on games', difficulty: 1, impact: 9, status: 'not_started', revenueGrowth: true, marginExpansion: true, operations: false, compliance: false, aiStrategic: false, notes: 'Direct, repeatable EBITDA lever', owner: 'Mario' },
  { id: '2', initiative: 'A/B test loosening withdrawal requirements', difficulty: 1, impact: 8, status: 'not_started', revenueGrowth: true, marginExpansion: true, operations: false, compliance: false, aiStrategic: false, notes: 'Fastest signal on abuse vs retention', owner: 'Guillaume' },
  { id: '3', initiative: 'Kill mining extractors cohort', difficulty: 2, impact: 8, status: 'not_started', revenueGrowth: false, marginExpansion: true, operations: true, compliance: false, aiStrategic: false, notes: 'Margin + system integrity', owner: 'Guillaume' },
  { id: '4', initiative: 'Gamification / Retention (buttoning up rewards, rakeback, UX, etc)', difficulty: 5, impact: 10, status: 'not_started', revenueGrowth: false, marginExpansion: true, operations: false, compliance: false, aiStrategic: true, notes: 'North Star Metric', owner: 'Hayden' },
  { id: '5', initiative: 'God Mode playthrough feature', difficulty: 3, impact: 8, status: 'not_started', revenueGrowth: true, marginExpansion: true, operations: false, compliance: false, aiStrategic: false, notes: 'Improves LTV + reward recycling', owner: 'Guillaume' },
  { id: '6', initiative: 'Revenue Based Financing / Other Financing', difficulty: 3, impact: 8, status: 'not_started', revenueGrowth: true, marginExpansion: false, operations: true, compliance: false, aiStrategic: false, notes: 'Facilitate aggressive revenue targets', owner: 'Alex' },
  { id: '7', initiative: 'International expansion + Localization', difficulty: 5, impact: 10, status: 'not_started', revenueGrowth: true, marginExpansion: true, operations: false, compliance: false, aiStrategic: true, notes: 'Start with 2-4 countries', owner: 'Trishul' },
  { id: '8', initiative: 'Remove blacklisted states / countries', difficulty: 2, impact: 6, status: 'not_started', revenueGrowth: false, marginExpansion: false, operations: false, compliance: true, aiStrategic: false, notes: 'Compliance + platform optics', owner: 'Hayden' },
  { id: '9', initiative: 'Expand new growth initiatives (Affiliate, Clipping)', difficulty: 3, impact: 7, status: 'not_started', revenueGrowth: true, marginExpansion: false, operations: false, compliance: false, aiStrategic: false, notes: 'Diversify UA risk', owner: 'Alex' },
  { id: '10', initiative: 'Secure relationship with Facebook advertising', difficulty: 5, impact: 8, status: 'not_started', revenueGrowth: true, marginExpansion: false, operations: false, compliance: false, aiStrategic: false, notes: 'Hedge UA platform risk', owner: 'Alex' },
  { id: '11', initiative: 'Migrate to Breeze to increase margin', difficulty: 3, impact: 8, status: 'not_started', revenueGrowth: true, marginExpansion: true, operations: false, compliance: false, aiStrategic: false, notes: 'Structural margin expansion', owner: 'Mario' },
  { id: '12', initiative: 'Secure relationship with Apple & Google internal teams', difficulty: 8, impact: 10, status: 'not_started', revenueGrowth: false, marginExpansion: false, operations: false, compliance: true, aiStrategic: false, notes: 'Platform-level risk reducer', owner: 'Alex' },
]

// --- localStorage helpers ---
function loadFromStorage(): { items: Initiative[]; sortKey: SortKey; sortDir: 'asc' | 'desc' } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.items)) return parsed
  } catch { /* ignore corrupt data */ }
  return null
}

function saveToStorage(items: Initiative[], sortKey: SortKey, sortDir: 'asc' | 'desc') {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, sortKey, sortDir }))
  } catch { /* storage full, ignore */ }
}

// --- Google Sheets helpers ---
type SyncStatus = 'disconnected' | 'syncing' | 'synced' | 'error'

function getSheetsUrl(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(SHEETS_URL_KEY) || ''
}

function setSheetsUrl(url: string) {
  if (typeof window === 'undefined') return
  if (url) localStorage.setItem(SHEETS_URL_KEY, url)
  else localStorage.removeItem(SHEETS_URL_KEY)
}

async function fetchFromSheets(url: string): Promise<Initiative[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) {
    if (data.error) throw new Error(data.error)
    return []
  }
  // Map sheet rows to our Initiative type
  return data.map((row: any) => ({
    id: String(row.id || Date.now() + Math.random()),
    initiative: row.initiative || '',
    difficulty: Number(row.difficulty) || 1,
    impact: Number(row.impact) || 5,
    status: (['not_started', 'in_progress', 'blocked', 'done'].includes(row.status) ? row.status : 'not_started') as Status,
    revenueGrowth: row.revenueGrowth === true || row.revenueGrowth === 'TRUE',
    marginExpansion: row.marginExpansion === true || row.marginExpansion === 'TRUE',
    operations: row.operations === true || row.operations === 'TRUE',
    compliance: row.compliance === true || row.compliance === 'TRUE',
    aiStrategic: row.aiStrategic === true || row.aiStrategic === 'TRUE',
    notes: row.notes || '',
    owner: row.owner || '',
  }))
}

async function saveToSheets(url: string, items: Initiative[]): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(items),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
}

// --- Sub-components ---

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

function TagPill({ tagKey, active, onClick }: { tagKey: TagKey; active: boolean; onClick: () => void }) {
  const cfg = TAG_CONFIG[tagKey]
  return (
    <button
      onClick={onClick}
      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-all whitespace-nowrap ${
        active ? cfg.activeClass : cfg.inactiveClass
      } hover:opacity-80`}
    >
      {cfg.label}
    </button>
  )
}

function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  renderValue,
  minWidth = 56,
}: {
  value: T
  options: T[]
  onChange: (v: T) => void
  renderValue?: (v: T) => React.ReactNode
  minWidth?: number
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-grid hover:border-text-secondary transition-all text-sm text-text-primary bg-card justify-between"
        style={{ minWidth }}
      >
        <span className="truncate">{renderValue ? renderValue(value) : String(value)}</span>
        <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-grid rounded-lg shadow-xl overflow-hidden max-h-[200px] overflow-y-auto" style={{ minWidth }}>
            {options.map((opt) => (
              <button
                key={String(opt)}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-grid ${
                  value === opt ? 'text-accent-green bg-accent-green/5' : 'text-text-primary'
                }`}
              >
                {String(opt)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  const [open, setOpen] = useState(false)
  const cfg = STATUS_CONFIG[status]
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-2 py-1 rounded-md text-xs font-medium transition-all border border-transparent hover:border-grid ${cfg.bg} ${cfg.color} whitespace-nowrap`}
      >
        {cfg.label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1 bg-card border border-grid rounded-lg shadow-xl overflow-hidden min-w-[120px]">
            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
              const c = STATUS_CONFIG[s]
              return (
                <button
                  key={s}
                  onClick={() => { onChange(s); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-grid ${
                    status === s ? `${c.color} bg-accent-green/5` : 'text-text-primary'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function SortableHeader({ label, sortKey: colKey, currentSortKey, sortDir, onSort, center }: {
  label: React.ReactNode
  sortKey: SortKey
  currentSortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  center?: boolean
}) {
  const isActive = currentSortKey === colKey
  return (
    <button
      onClick={() => onSort(colKey)}
      className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors w-full ${
        center ? 'justify-center' : ''
      } ${isActive ? 'text-accent-green' : 'text-text-secondary hover:text-text-primary'}`}
    >
      <span>{label}</span>
      {isActive ? (
        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30" />
      )}
    </button>
  )
}

// --- Grid column definition ---
// grip / rank / initiative / status / diff / impact / score / tags / notes / owner / delete
const GRID_COLS = '40px 40px 1fr 100px 72px 72px 64px 200px 1fr 110px 40px'

const STATUS_ORDER: Record<Status, number> = { in_progress: 0, blocked: 1, not_started: 2, done: 3 }

// --- Sheet connect modal ---
function SheetConnectModal({ currentUrl, onSave, onDisconnect, onClose }: {
  currentUrl: string
  onSave: (url: string) => void
  onDisconnect: () => void
  onClose: () => void
}) {
  const [url, setUrl] = useState(currentUrl)
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-grid rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Connect Google Sheet</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-text-secondary text-sm mb-4">
          Paste the Web App URL from your Google Apps Script deployment. See the setup guide for details.
        </p>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/.../exec"
          className="w-full bg-background border border-grid rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 outline-none focus:border-accent-green transition-colors mb-4"
          autoFocus
        />
        <div className="flex items-center justify-between">
          {currentUrl ? (
            <button
              onClick={onDisconnect}
              className="text-sm text-danger-red hover:text-danger-red/80 transition-colors"
            >
              Disconnect
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary border border-grid transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { if (url.trim()) onSave(url.trim()) }}
              disabled={!url.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-background hover:bg-accent-green-light transition-colors disabled:opacity-40"
            >
              Save & Sync
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PrioritiesPage() {
  const [items, setItems] = useState<Initiative[]>(INITIAL_DATA)
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const hasHydrated = useRef(false)

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Sheets sync state
  const [sheetsUrl, _setSheetsUrl] = useState('')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('disconnected')
  const [showSheetModal, setShowSheetModal] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSaving = useRef(false)

  // Load from localStorage on mount, then fetch from Sheets if connected
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) {
      setItems(saved.items)
      if (saved.sortKey !== undefined) setSortKey(saved.sortKey)
      if (saved.sortDir) setSortDir(saved.sortDir)
    }
    hasHydrated.current = true

    // Check for connected sheet
    const url = getSheetsUrl()
    if (url) {
      _setSheetsUrl(url)
      setSyncStatus('syncing')
      fetchFromSheets(url)
        .then((sheetItems) => {
          if (sheetItems.length > 0) {
            setItems(sheetItems)
          }
          setSyncStatus('synced')
          setLastSynced(new Date())
        })
        .catch(() => setSyncStatus('error'))
    }
  }, [])

  // Persist locally on change
  useEffect(() => {
    if (hasHydrated.current) saveToStorage(items, sortKey, sortDir)
  }, [items, sortKey, sortDir])

  // Debounced save to Sheets (1.5s after last change)
  const scheduleSheetsSync = useCallback((updatedItems: Initiative[]) => {
    if (!sheetsUrl) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSyncStatus('syncing')
    saveTimer.current = setTimeout(async () => {
      if (isSaving.current) return
      isSaving.current = true
      try {
        await saveToSheets(sheetsUrl, updatedItems)
        setSyncStatus('synced')
        setLastSynced(new Date())
      } catch {
        setSyncStatus('error')
      } finally {
        isSaving.current = false
      }
    }, 1500)
  }, [sheetsUrl])

  // When items change, schedule a Sheets save
  useEffect(() => {
    if (hasHydrated.current && sheetsUrl) {
      scheduleSheetsSync(items)
    }
  }, [items, sheetsUrl, scheduleSheetsSync])

  const handleSheetSave = useCallback(async (url: string) => {
    _setSheetsUrl(url)
    setSheetsUrl(url)
    setShowSheetModal(false)
    setSyncStatus('syncing')
    try {
      // First try to fetch existing data
      const sheetItems = await fetchFromSheets(url)
      if (sheetItems.length > 0) {
        setItems(sheetItems)
      } else {
        // No data in sheet yet — push current items
        await saveToSheets(url, items)
      }
      setSyncStatus('synced')
      setLastSynced(new Date())
    } catch {
      setSyncStatus('error')
    }
  }, [items])

  const handleSheetDisconnect = useCallback(() => {
    _setSheetsUrl('')
    setSheetsUrl('')
    setSyncStatus('disconnected')
    setLastSynced(null)
    setShowSheetModal(false)
  }, [])

  // Sort logic
  const displayItems = useMemo(() => {
    if (sortKey === null) return items // manual mode

    const dir = sortDir === 'asc' ? 1 : -1
    return [...items].sort((a, b) => {
      switch (sortKey) {
        case 'score': return dir * ((a.impact - a.difficulty) - (b.impact - b.difficulty))
        case 'difficulty': return dir * (a.difficulty - b.difficulty)
        case 'impact': return dir * (a.impact - b.impact)
        case 'status': return dir * (STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
        case 'owner': return dir * a.owner.localeCompare(b.owner)
        case 'initiative': return dir * a.initiative.localeCompare(b.initiative)
        default: return 0
      }
    })
  }, [items, sortKey, sortDir])

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) {
        // Toggle direction
        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        return prev
      }
      // New column: default direction
      setSortDir(key === 'score' || key === 'impact' ? 'desc' : 'asc')
      return key
    })
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<Initiative>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }, [])

  const addItem = useCallback(() => {
    setItems(prev => [...prev, {
      id: String(Date.now()),
      initiative: '',
      difficulty: 1,
      impact: 5,
      status: 'not_started',
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

  const moveItem = useCallback((fromId: string, toId: string) => {
    setItems(prev => {
      const currentOrder = sortKey === null
        ? prev
        : [...prev].sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1
            switch (sortKey) {
              case 'score': return dir * ((a.impact - a.difficulty) - (b.impact - b.difficulty))
              case 'difficulty': return dir * (a.difficulty - b.difficulty)
              case 'impact': return dir * (a.impact - b.impact)
              case 'status': return dir * (STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
              case 'owner': return dir * a.owner.localeCompare(b.owner)
              case 'initiative': return dir * a.initiative.localeCompare(b.initiative)
              default: return 0
            }
          })

      const reordered = [...currentOrder]
      const fromIndex = reordered.findIndex(i => i.id === fromId)
      const toIndex = reordered.findIndex(i => i.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev
      const [moved] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, moved)
      return reordered
    })
    setSortKey(null)
  }, [sortKey, sortDir])

  // Pointer-based drag on grip handle
  const handleGripPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault()
    setDraggingId(id)

    const handlePointerMove = (ev: PointerEvent) => {
      for (const [rowId, el] of rowRefs.current.entries()) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
          setDragOverId(rowId !== id ? rowId : null)
          break
        }
      }
    }

    const handlePointerUp = () => {
      setDraggingId(null)
      setDragOverId(prev => {
        if (prev && prev !== id) moveItem(id, prev)
        return null
      })
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }, [moveItem])

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-green transition-colors mb-4 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Global <span className="text-accent-green">Priorities</span>
            </h1>
            <p className="text-text-secondary">
              {sortKey !== null
                ? `Sorted by ${sortKey} (${sortDir}) • ${items.length} initiatives`
                : `Manual ordering • ${items.length} initiatives`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync status indicator */}
            {sheetsUrl && (
              <button
                onClick={() => setShowSheetModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                  syncStatus === 'synced'
                    ? 'border-accent-green/30 text-accent-green'
                    : syncStatus === 'syncing'
                    ? 'border-warning-yellow/30 text-warning-yellow'
                    : syncStatus === 'error'
                    ? 'border-danger-red/30 text-danger-red'
                    : 'border-grid text-text-secondary'
                }`}
                title={lastSynced ? `Last synced ${lastSynced.toLocaleTimeString()}` : 'Google Sheets connected'}
              >
                {syncStatus === 'syncing' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : syncStatus === 'synced' ? (
                  <Cloud className="w-3.5 h-3.5" />
                ) : syncStatus === 'error' ? (
                  <CloudOff className="w-3.5 h-3.5" />
                ) : (
                  <Cloud className="w-3.5 h-3.5" />
                )}
                {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : syncStatus === 'error' ? 'Sync Error' : 'Sheet'}
              </button>
            )}
            {!sheetsUrl && (
              <button
                onClick={() => setShowSheetModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-grid text-text-secondary hover:border-accent-green hover:text-accent-green transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                Connect Sheet
              </button>
            )}
            {sortKey === null && (
              <button
                onClick={() => { setSortKey('score'); setSortDir('desc') }}
                className="px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 border border-grid text-text-secondary hover:border-accent-green hover:text-accent-green"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Score
              </button>
            )}
            {sortKey !== null && (
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Hand className="w-3.5 h-3.5" />
                Drag to reorder
              </div>
            )}
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
          {/* Header Row */}
          <div className="bg-card border-b border-grid">
            <div className="grid items-center gap-0" style={{ gridTemplateColumns: GRID_COLS }}>
              <div className="px-2 py-3" />
              <div className="px-2 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">#</div>
              <SortableHeader label="Initiative" sortKey="initiative" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Status" sortKey="status" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} center />
              <SortableHeader label="Diff" sortKey="difficulty" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} center />
              <SortableHeader label="Impact" sortKey="impact" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} center />
              <SortableHeader label="Score" sortKey="score" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} center />
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tags</div>
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Notes</div>
              <SortableHeader label="Owner" sortKey="owner" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <div className="px-2 py-3" />
            </div>
          </div>

          {/* Body */}
          <div>
            {displayItems.map((item, index) => {
              const score = item.impact - item.difficulty
              const isDragging = draggingId === item.id
              return (
                <div
                  key={item.id}
                  ref={(el) => { if (el) rowRefs.current.set(item.id, el); else rowRefs.current.delete(item.id) }}
                  className={`grid items-center gap-0 border-b border-grid last:border-b-0 hover:bg-card/50 transition-colors group ${
                    isDragging ? 'opacity-30' : ''
                  } ${dragOverId === item.id ? 'border-t-2 border-t-accent-green' : ''} ${item.status === 'done' ? 'opacity-50' : ''}`}
                  style={{ gridTemplateColumns: GRID_COLS }}
                >
                  {/* Grip */}
                  <div
                    className="px-2 py-3 flex justify-center cursor-grab active:cursor-grabbing select-none touch-none"
                    onPointerDown={(e) => handleGripPointerDown(e, item.id)}
                  >
                    <GripVertical className="w-4 h-4 text-grid group-hover:text-text-secondary transition-colors" />
                  </div>

                  {/* Rank */}
                  <div className="px-2 py-3 text-center">
                    <span className="text-text-secondary font-mono text-sm">{index + 1}</span>
                  </div>

                  {/* Initiative */}
                  <div className="px-3 py-3">
                    <input
                      type="text"
                      value={item.initiative}
                      onChange={(e) => updateItem(item.id, { initiative: e.target.value })}
                      className={`w-full bg-transparent text-sm border-0 outline-none focus:ring-0 placeholder-text-secondary/50 hover:bg-grid/50 focus:bg-grid/50 rounded px-1 py-0.5 -ml-1 transition-colors ${
                        item.status === 'done' ? 'text-text-secondary line-through' : 'text-text-primary'
                      }`}
                      placeholder="Enter initiative name..."
                    />
                  </div>

                  {/* Status */}
                  <div className="px-2 py-3 flex justify-center">
                    <StatusBadge status={item.status} onChange={(s) => updateItem(item.id, { status: s })} />
                  </div>

                  {/* Difficulty */}
                  <div className="px-2 py-3 flex justify-center">
                    <Dropdown value={item.difficulty} options={FIB_VALUES} onChange={(v) => updateItem(item.id, { difficulty: v })} />
                  </div>

                  {/* Impact */}
                  <div className="px-2 py-3 flex justify-center">
                    <Dropdown value={item.impact} options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} onChange={(v) => updateItem(item.id, { impact: v })} />
                  </div>

                  {/* Score */}
                  <div className="px-2 py-3 flex justify-center">
                    <ScoreBadge score={score} />
                  </div>

                  {/* Tags */}
                  <div className="px-3 py-3 flex flex-wrap gap-1">
                    {TAG_KEYS.map((key) => (
                      <TagPill
                        key={key}
                        tagKey={key}
                        active={item[key]}
                        onClick={() => updateItem(item.id, { [key]: !item[key] })}
                      />
                    ))}
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
                  <div className="px-2 py-3">
                    <Dropdown value={item.owner} options={OWNERS} onChange={(v) => updateItem(item.id, { owner: v })} renderValue={(v) => v || 'Select'} minWidth={90} />
                  </div>

                  {/* Delete */}
                  <div className="px-2 py-3 flex justify-center">
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
          <div className="flex items-center gap-4 ml-auto">
            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
              const count = items.filter(i => i.status === s).length
              if (count === 0) return null
              return (
                <span key={s} className={`${STATUS_CONFIG[s].color} text-xs`}>
                  {count} {STATUS_CONFIG[s].label}
                </span>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-grid text-center text-text-secondary text-sm">
        <p>Ember Global Priorities v1.0 • Built with Next.js</p>
      </footer>

      {/* Sheet Connect Modal */}
      {showSheetModal && (
        <SheetConnectModal
          currentUrl={sheetsUrl}
          onSave={handleSheetSave}
          onDisconnect={handleSheetDisconnect}
          onClose={() => setShowSheetModal(false)}
        />
      )}
    </div>
  )
}
