'use client'

import Link from 'next/link'
import { BookOpen, Plane } from 'lucide-react'
import { useLaunchpadStore } from '@/lib/store'
import { STEPS } from '@/lib/steps'
import { StepNode } from './StepNode'
import { FlightPath } from './FlightPath'
import { ProjectNameInput } from '@/components/ui/ProjectNameInput'

// Absolute positions for each StepNode on the canvas
// Slightly diagonal arrangement for a dynamic, non-static look
const NODE_POSITIONS = {
  scan:    { x: '4%',  y: '42%' },
  target:  { x: '26%', y: '62%' },
  engine:  { x: '55%', y: '34%' },
  takeoff: { x: '74%', y: '56%' },
}

export function LaunchpadCanvas() {
  const { steps } = useLaunchpadStore()

  const completedCount = Object.values(steps).filter((s) => s.completed).length

  const isInProgress = (stepId: string) => {
    const s = steps[stepId as keyof typeof steps]
    return !s.completed && Object.keys(s.fields).length > 0
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: '#1f1f2e',
        }}
      >
        <div className="flex items-center gap-3">
          <Plane size={20} style={{ color: '#6366f1' }} />
          <span
            className="font-display font-bold text-base tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            AI Launchpad
          </span>
        </div>

        <ProjectNameInput />

        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {completedCount}/4 Etappen
          </span>
          <Link
            href="/glossar"
            className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Glossar öffnen"
          >
            <BookOpen size={16} />
            <span className="hidden md:inline">Glossar</span>
          </Link>
        </div>
      </header>

      {/* Desktop Canvas */}
      <main className="flex-1 hidden md:block relative overflow-hidden" style={{ minHeight: '540px' }}>
        <FlightPath completedCount={completedCount} />
        {STEPS.map((step) => (
          <StepNode
            key={step.id}
            step={step}
            completed={steps[step.id].completed}
            inProgress={isInProgress(step.id)}
            position={NODE_POSITIONS[step.id]}
          />
        ))}
      </main>

      {/* Mobile: vertical list */}
      <main className="flex-1 flex flex-col gap-4 px-4 py-6 md:hidden">
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
          Wähle eine Etappe um zu starten:
        </p>
        {STEPS.map((step) => (
          <MobileStepCard
            key={step.id}
            step={step}
            completed={steps[step.id].completed}
            inProgress={isInProgress(step.id)}
          />
        ))}
      </main>
    </div>
  )
}

// Simplified card for mobile
function MobileStepCard({
  step,
  completed,
  inProgress,
}: {
  step: (typeof STEPS)[0]
  completed: boolean
  inProgress: boolean
}) {
  const borderColor = completed ? step.color : inProgress ? `${step.color}80` : '#3f3f46'
  const titleColor = completed ? step.color : inProgress ? `${step.color}CC` : 'var(--text-muted)'

  return (
    <a
      href={`/step/${step.id}`}
      className="block rounded-2xl border-2 p-5 transition-all active:scale-98"
      style={{
        borderColor,
        borderStyle: inProgress && !completed ? 'dashed' : 'solid',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: completed ? `0 0 16px ${step.color}25` : 'none',
        textDecoration: 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{step.emoji}</span>
          <div>
            <div className="font-display font-bold text-sm" style={{ color: titleColor }}>
              {step.title}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {step.subtitle}
            </div>
          </div>
        </div>
        {completed && (
          <div className="rounded-full p-1" style={{ backgroundColor: step.color }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
    </a>
  )
}
