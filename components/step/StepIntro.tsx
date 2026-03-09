'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Users } from 'lucide-react'
import { Step } from '@/lib/steps'
import { Button } from '@/components/ui/Button'

interface Props {
  step: Step
  onContinue: () => void
}

export function StepIntro({ step, onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* What happens in this stage */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Was passiert hier?
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {step.content}
        </p>
      </div>

      {/* Input requirements */}
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: '#2d2d3e',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} style={{ color: step.color }} />
          <h2
            className="text-sm font-semibold"
            style={{ color: step.color }}
          >
            Was brauchst du?
          </h2>
        </div>
        <ul className="space-y-2.5">
          {step.input.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: `${step.color}80` }}
              />
              <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button accentColor={step.color} onClick={onContinue} size="lg">
        Los geht&#39;s →
      </Button>
    </motion.div>
  )
}
