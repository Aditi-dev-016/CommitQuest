'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  GitBranch, ZoomIn, ZoomOut, RotateCcw,
  Database, Globe, Lock, Shield, Cpu, X,
} from 'lucide-react'

// ── Static mock architecture nodes (real data comes from API in full impl) ──
const MOCK_NODES = [
  { id: '1', title: 'Repository Core',   type: 'core',     icon: Cpu,      x: 100, y: 200, active: false, locked: false },
  { id: '2', title: 'Frontend Layer',    type: 'frontend', icon: Globe,    x: 420, y: 80,  active: false, locked: false },
  { id: '3', title: 'API Layer',         type: 'api',      icon: GitBranch,x: 420, y: 230, active: true,  locked: false },
  { id: '4', title: 'Database Layer',    type: 'database', icon: Database, x: 420, y: 380, active: false, locked: true  },
  { id: '5', title: 'Authentication',    type: 'auth',     icon: Shield,   x: 650, y: 160, active: false, locked: false },
] as const

const MOCK_EDGES: [string, string][] = [
  ['1', '2'], ['1', '3'], ['3', '4'], ['3', '5'],
]

interface Node {
  id: string; title: string; type: string
  icon: React.ElementType; x: number; y: number
  active: boolean; locked: boolean
}

export default function ExplorePage() {
  const [selected, setSelected]   = useState<Node | null>(null)
  const [scale, setScale]         = useState(1)
  const [offset, setOffset]       = useState({ x: 0, y: 0 })
  const [isDragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  function zoom(delta: number) {
    setScale((s) => Math.min(2, Math.max(0.4, s + delta)))
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  function handleMouseUp() { setDragging(false) }

  return (
    <AppShell title="Repository Explorer">
      <div className="flex gap-0 h-[calc(100vh-128px)] -mx-8 -mb-8 overflow-hidden rounded-xl border border-border">

        {/* Canvas */}
        <div
          className="relative flex-1 bg-bg-nested overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          aria-label="Repository architecture map"
          role="img"
        >
          {/* SVG edges */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0' }}
            width="800" height="600"
          >
            {MOCK_EDGES.map(([fromId, toId]) => {
              const from = MOCK_NODES.find((n) => n.id === fromId)
              const to   = MOCK_NODES.find((n) => n.id === toId)
              if (!from || !to) return null
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x + 80} y1={from.y + 36}
                  x2={to.x}        y2={to.y + 36}
                  stroke="#30363D" strokeWidth="1.5" strokeDasharray="4 3"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          <div
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0', position: 'absolute' }}
          >
            {MOCK_NODES.map((node) => (
              <ArchNode
                key={node.id}
                node={node as Node}
                isSelected={selected?.id === node.id}
                onClick={() => setSelected(node === selected ? null : node as Node)}
              />
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5" aria-label="Map controls">
            <button
              onClick={() => zoom(0.15)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-primary shadow-elevated transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => zoom(-0.15)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-primary shadow-elevated transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }) }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-surface border border-border text-text-secondary hover:text-text-primary shadow-elevated transition-colors"
              aria-label="Reset view"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Right AI guide panel */}
        <aside
          className="w-80 shrink-0 border-l border-border bg-bg-surface flex flex-col overflow-y-auto"
          aria-label="AI Repository Guide"
        >
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <GitBranch size={16} className="text-accent-purple" aria-hidden="true" />
            <span className="text-sm font-bold text-text-primary">AI Repository Guide</span>
          </div>

          {selected ? (
            <NodePanel node={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="p-5 flex flex-col gap-4">
              <div className="rounded-md border border-border bg-bg-nested p-4">
                <p className="font-mono text-2xs uppercase text-text-muted mb-2">Exploration Progress</p>
                <p className="font-mono text-3xl font-bold text-text-code">12%</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-1">Start Here</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Click any node on the map to explore its purpose, key files, and how it connects to the rest of the codebase.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">Recommended Path</p>
                {['1. Start with Repository Core', '2. Explore the API Layer', '3. Check Authentication'].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-text-secondary mb-2">
                    <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-mono text-2xs">
                      {i + 1}
                    </span>
                    {step.replace(/^\d\. /, '')}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto p-4 border-t border-border">
            <Button variant="outline" size="md" className="w-full">
              Ask AI Assistant
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

function ArchNode({
  node, isSelected, onClick,
}: { node: Node; isSelected: boolean; onClick: () => void }) {
  const Icon = node.icon

  return (
    <button
      onClick={onClick}
      disabled={node.locked}
      style={{ position: 'absolute', left: node.x, top: node.y }}
      className={cn(
        'w-40 rounded-lg border p-3 text-left transition-all',
        node.locked
          ? 'opacity-40 cursor-not-allowed border-border bg-bg-surface'
          : isSelected || node.active
          ? 'border-[#D0BCFF] bg-bg-surface shadow-[0_0_15px_rgba(208,188,255,0.2)] cursor-pointer'
          : 'border-border bg-bg-surface hover:border-[rgba(94,106,210,0.4)] cursor-pointer'
      )}
      aria-pressed={isSelected}
      aria-label={`${node.title}${node.locked ? ' (locked)' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg-elevated border border-border">
          <Icon size={14} className={node.active || isSelected ? 'text-accent-purple-light' : 'text-text-muted'} aria-hidden="true" />
        </div>
        {(node.active || isSelected) && (
          <span className="h-3 w-3 rounded-full bg-accent-purple-light shadow-glow-purple" aria-hidden="true" />
        )}
        {node.locked && <Lock size={12} className="text-text-muted" aria-hidden="true" />}
      </div>
      <p className="font-mono text-xs text-text-canvas leading-tight">{node.title}</p>
      <p className="font-mono text-2xs text-text-muted capitalize mt-0.5">{node.type}</p>
    </button>
  )
}

function NodePanel({ node, onClose }: { node: Node; onClose: () => void }) {
  const Icon = node.icon
  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg-elevated border border-border">
            <Icon size={14} className="text-accent-purple-light" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">{node.title}</p>
            <Badge variant="purple" className="mt-0.5">{node.type}</Badge>
          </div>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors" aria-label="Close node panel">
          <X size={15} />
        </button>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        This module handles core functionality for the {node.title.toLowerCase()} layer. Click "Set as Next Quest" to get AI-guided steps for contributing to this area.
      </p>

      <div>
        <p className="font-mono text-2xs uppercase text-text-muted mb-2">Key Files</p>
        <div className="flex flex-col gap-1">
          {['src/index.ts', 'src/router.ts', 'src/middleware.ts'].map((f) => (
            <code key={f} className="font-mono text-xs text-text-code bg-bg-nested rounded px-2 py-1">
              {f}
            </code>
          ))}
        </div>
      </div>

      <Button variant="secondary" size="md" className="w-full">
        Set as Next Quest
      </Button>
    </div>
  )
}
