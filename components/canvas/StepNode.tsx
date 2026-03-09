'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Step } from '@/lib/steps'

interface Props {
  step: Step
  completed: boolean
  inProgress: boolean // Etappe gestartet aber noch nicht abgeschlossen
  position: { x: string; y: string }
}

export function StepNode({ step, completed, inProgress, position }: Props) {
  const router = useRouter()

  const borderColor = completed
    ? step.color
    : inProgress
    ? `${step.color}80`
    : '#3f3f46'

  const titleColor = completed
    ? step.color
    : inProgress
    ? `${step.color}CC`
    : 'var(--text-muted)'

  return (
    <motion.div
      layoutId={`step-${step.id}`}
      className="absolute cursor-pointer rounded-2xl border-2 p-5 w-52 md:w-60"
      style={{
        left: position.x,
        top: position.y,
        borderColor,
        borderStyle: inProgress && !completed ? 'dashed' : 'solid',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: completed ? `0 0 24px ${step.color}30` : 'none',
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 0 32px ${step.color}40`,
      }}
      onClick={() => router.push(`/step/${step.id}`)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="text-2xl mb-2">{step.emoji}</div>
      <div
        className="font-display font-bold text-base leading-tight"
        style={{ color: titleColor }}
      >
        {step.title}
      </div>
      <div
        className="text-xs mt-1 leading-snug"
        style={{ color: 'var(--text-muted)' }}
      >
        {step.subtitle}
      </div>

      {completed && (
        <div
          className="absolute top-3 right-3 rounded-full p-1"
          style={{ backgroundColor: step.color }}
        >
          <Check size={11} className="text-white" />
        </div>
      )}
    </motion.div>
  )
}
