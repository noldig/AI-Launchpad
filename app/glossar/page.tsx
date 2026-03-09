import Link from 'next/link'
import { ArrowLeft, Plane } from 'lucide-react'
import { GLOSSARY } from '@/lib/glossary'

const CATEGORIES = {
  etappen: 'Die vier Etappen',
  technologie: 'Technologie & Umsetzung',
  messung: 'Erfolg & Messung',
  risiken: 'Sicherheit & Risiken',
}

export default function GlossarPage() {
  const grouped = Object.entries(CATEGORIES).map(([key, label]) => ({
    key,
    label,
    entries: GLOSSARY.filter((e) => e.category === key),
  }))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
        style={{ backgroundColor: 'var(--bg-canvas)', borderColor: '#1f1f2e' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
            Zurück
          </Link>
          <span style={{ color: '#2d2d3e' }}>|</span>
          <div className="flex items-center gap-2">
            <Plane size={16} style={{ color: '#6366f1' }} />
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
              AI Launchpad
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        <h1
          className="font-display font-bold text-2xl md:text-3xl mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Glossar
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
          Alle Begriffe des AI Launchpad erklärt.
        </p>

        <div className="space-y-10">
          {grouped.map(({ key, label, entries }) => (
            <section key={key}>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </h2>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.term}
                    className="rounded-xl border px-5 py-4"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: '#2d2d3e',
                    }}
                  >
                    <div
                      className="font-display font-semibold text-sm mb-1.5"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {entry.term}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {entry.definition}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
