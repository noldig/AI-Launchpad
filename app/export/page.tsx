'use client'

import Link from 'next/link'
import { Plane, ArrowLeft, Download, Mail, RotateCcw } from 'lucide-react'
import { useLaunchpadStore } from '@/lib/store'
import { STEPS } from '@/lib/steps'
import { ProjectNameInput } from '@/components/ui/ProjectNameInput'

export default function ExportPage() {
  const { steps, projectName, resetAll } = useLaunchpadStore()

  const completedCount = Object.values(steps).filter((s) => s.completed).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-6 py-4 border-b sticky top-0 z-10"
        style={{ backgroundColor: 'var(--bg-canvas)', borderColor: '#1f1f2e' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Übersicht</span>
          </Link>
          <span style={{ color: '#2d2d3e' }}>|</span>
          <Plane size={16} style={{ color: '#6366f1' }} />
          <span className="font-display font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI Launchpad
          </span>
        </div>
        <ProjectNameInput />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {completedCount}/4
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        {/* Ready for Development Banner */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🛫</div>
          <h1
            className="font-display font-bold text-2xl md:text-3xl mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready for Development
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Vier Etappen. Ein Flight Brief.{' '}
            {projectName ? (
              <>
                <span style={{ color: '#6366f1' }}>{projectName}</span>{' '}
              </>
            ) : null}
            Dein Projekt ist bereit für den Bau.
          </p>
        </div>

        {/* Flight Brief Summary */}
        <div className="space-y-4 mb-10">
          {STEPS.map((step) => {
            const s = steps[step.id]
            const filledFields = step.brief.filter((f) => s.fields[f.key]?.trim())
            return (
              <div
                key={step.id}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: s.completed ? `${step.color}40` : '#2d2d3e' }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ backgroundColor: s.completed ? `${step.color}15` : 'var(--bg-elevated)' }}
                >
                  <span>{step.emoji}</span>
                  <span
                    className="font-display font-bold text-sm"
                    style={{ color: s.completed ? step.color : 'var(--text-muted)' }}
                  >
                    {step.title}
                  </span>
                  {s.completed && (
                    <span className="ml-auto text-xs" style={{ color: `${step.color}80` }}>
                      ✓ Abgeschlossen
                    </span>
                  )}
                </div>
                {filledFields.length > 0 && (
                  <div className="px-5 py-4 space-y-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    {filledFields.map((f) => (
                      <div key={f.key}>
                        <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                          {f.label}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {s.fields[f.key]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Export Actions */}
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium text-sm transition-all opacity-50 cursor-not-allowed"
            style={{ backgroundColor: '#6366f1', color: 'white' }}
            disabled
            title="PDF-Export kommt in Phase B"
          >
            <Download size={16} />
            PDF herunterladen (kommt bald)
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-medium text-sm transition-all opacity-50 cursor-not-allowed"
            style={{ borderColor: '#3f3f46', color: 'var(--text-secondary)' }}
            disabled
            title="Mail-Versand kommt in Phase B"
          >
            <Mail size={16} />
            Per Mail versenden (kommt bald)
          </button>
          <button
            onClick={resetAll}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium text-sm transition-all hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw size={14} />
            Neue Session starten
          </button>
        </div>
      </main>
    </div>
  )
}
