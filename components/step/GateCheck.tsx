'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, Lock } from 'lucide-react'
import { Step, StepId, getNextStep } from '@/lib/steps'
import { useLaunchpadStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'

interface Props {
  step: Step
}

export function GateCheck({ step }: Props) {
  const router = useRouter()
  const { steps, setGateCheckItem, completeStep } = useLaunchpadStore()
  const stepState = steps[step.id as StepId]
  const checkedItems = stepState.checkedItems ?? []

  const allChecked =
    step.gateChecks.length > 0 &&
    step.gateChecks.every((_, i) => checkedItems[i] === true)

  const nextStepId = getNextStep(step.id as StepId)

  const handleComplete = () => {
    completeStep(step.id as StepId)
    if (nextStepId) {
      router.push('/')
    } else {
      router.push('/export')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          🛂 Gate Check
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Hake alle Punkte ab, um die Etappe abzuschliessen.
        </p>
      </div>

      <div className="space-y-3">
        {step.gateChecks.map((item, i) => {
          const checked = checkedItems[i] === true
          return (
            <motion.button
              key={i}
              onClick={() => setGateCheckItem(step.id as StepId, i, !checked)}
              className="w-full flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150"
              style={{
                borderColor: checked ? `${step.color}60` : '#3f3f46',
                backgroundColor: checked ? `${step.color}08` : 'var(--bg-surface)',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-pressed={checked}
            >
              <div
                className="shrink-0 mt-0.5 rounded-full w-5 h-5 flex items-center justify-center border-2 transition-all duration-200"
                style={{
                  borderColor: checked ? step.color : '#52525B',
                  backgroundColor: checked ? step.color : 'transparent',
                }}
              >
                <AnimatePresence>
                  {checked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check size={11} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span
                className="text-sm leading-snug transition-all duration-150"
                style={{
                  color: checked ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: checked ? 'line-through' : 'none',
                  opacity: checked ? 0.6 : 1,
                }}
              >
                {item}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="pt-2">
        {!allChecked && (
          <div
            className="flex items-center gap-2 mb-4 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <Lock size={12} />
            <span>
              {step.gateChecks.filter((_, i) => !checkedItems[i]).length} von{' '}
              {step.gateChecks.length} Punkten noch offen
            </span>
          </div>
        )}

        <Button
          accentColor={step.color}
          disabled={!allChecked}
          onClick={handleComplete}
          size="lg"
        >
          {nextStepId
            ? `Weiter zu ${nextStepId.toUpperCase()} →`
            : '🛫 Ready for Development →'}
        </Button>
      </div>
    </motion.div>
  )
}
