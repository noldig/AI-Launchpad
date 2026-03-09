'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Step, StepId } from '@/lib/steps'
import { useLaunchpadStore } from '@/lib/store'
import { StepIntro } from './StepIntro'
import { EthicsGuard } from './EthicsGuard'
import { FlightBrief } from './FlightBrief'
import { GateCheck } from './GateCheck'
import { Button } from '@/components/ui/Button'
import { Lightbulb, AlertTriangle } from 'lucide-react'

// Sub-steps:
// 0 = StepIntro
// 1 = EthicsGuard
// 2..n = questions (index = subStep - 2)
// n+1 = HelpQuestion card (if exists) — shown before brief
// n+2 = DecisionTree (ENGINE only) / ValidationPaths (TAKEOFF)
// "brief" = FlightBrief
// "gate" = GateCheck

type SubStep = number | 'brief' | 'gate'

interface Props {
  step: Step
}

// Progress labels for the breadcrumb
function getSubStepLabels(step: Step): string[] {
  const labels = ['Start', 'Leitplanke']
  step.questions.forEach((_, i) => labels.push(`Frage ${i + 1}`))
  if (step.helpQuestion) labels.push('Denkfrage')
  if (step.decisionTree) labels.push('Entscheidung')
  if (step.validationPaths) labels.push('Validierung')
  labels.push('Flight Brief')
  labels.push('Gate Check')
  return labels
}

function getSubStepIndex(subStep: SubStep, step: Step): number {
  if (typeof subStep === 'number') {
    if (subStep === 0) return 0
    if (subStep === 1) return 1
    return subStep // questions start at 2
  }
  const labels = getSubStepLabels(step)
  if (subStep === 'brief') return labels.length - 2
  if (subStep === 'gate') return labels.length - 1
  return 0
}

export function QuestionFlow({ step }: Props) {
  const { steps, setFieldValue } = useLaunchpadStore()
  const stepState = steps[step.id as StepId]
  const [subStep, setSubStep] = useState<SubStep>(0)

  const questionCount = step.questions.length
  // subStep 2...(2+questionCount-1) = questions
  const questionIndex = typeof subStep === 'number' && subStep >= 2
    ? subStep - 2
    : -1

  // Calculate what comes after questions
  const afterQuestionsStep = 2 + questionCount

  function nextAfterQuestions(): SubStep {
    if (step.helpQuestion && step.decisionTree) return afterQuestionsStep
    if (step.helpQuestion) return afterQuestionsStep
    if (step.decisionTree) return afterQuestionsStep
    if (step.validationPaths) return afterQuestionsStep
    return 'brief'
  }

  function resolveAfterExtras(offset = 0): SubStep {
    const extras: SubStep[] = []
    if (step.helpQuestion) extras.push(afterQuestionsStep + extras.length)
    if (step.decisionTree) extras.push(afterQuestionsStep + extras.length)
    if (step.validationPaths) extras.push(afterQuestionsStep + extras.length)
    if (offset < extras.length) return extras[offset] as SubStep
    return 'brief'
  }

  const labels = getSubStepLabels(step)
  const currentLabelIndex = getSubStepIndex(subStep, step)

  const handleNext = () => {
    if (subStep === 0) return setSubStep(1)
    if (subStep === 1) return setSubStep(2)

    if (typeof subStep === 'number' && subStep >= 2 && questionIndex < questionCount - 1) {
      return setSubStep(subStep + 1)
    }

    if (typeof subStep === 'number' && subStep >= 2 && questionIndex === questionCount - 1) {
      // Done with questions
      const next = nextAfterQuestions()
      return setSubStep(next)
    }

    if (typeof subStep === 'number' && subStep >= afterQuestionsStep) {
      // Moving through extras
      const extraOffset = subStep - afterQuestionsStep
      return setSubStep(resolveAfterExtras(extraOffset + 1))
    }

    if (subStep === 'brief') return setSubStep('gate')
  }

  return (
    <div className="space-y-6">
      {/* Progress breadcrumb */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full transition-all"
              style={{
                backgroundColor: i === currentLabelIndex
                  ? `${step.color}20`
                  : i < currentLabelIndex
                  ? `${step.color}10`
                  : 'transparent',
                color: i === currentLabelIndex
                  ? step.color
                  : i < currentLabelIndex
                  ? `${step.color}80`
                  : 'var(--text-muted)',
                fontWeight: i === currentLabelIndex ? 600 : 400,
              }}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>›</span>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {subStep === 0 && (
          <StepIntro key="intro" step={step} onContinue={handleNext} />
        )}

        {subStep === 1 && (
          <EthicsGuard
            key="ethics"
            ethicsGuard={step.ethicsGuard}
            stepColor={step.color}
            onContinue={handleNext}
          />
        )}

        {typeof subStep === 'number' && questionIndex >= 0 && questionIndex < questionCount && (
          <QuestionCard
            key={`q-${questionIndex}`}
            question={step.questions[questionIndex]}
            stepColor={step.color}
            savedValue={stepState.fields[step.questions[questionIndex].key] ?? ''}
            onAnswer={(val) => setFieldValue(step.id as StepId, step.questions[questionIndex].key, val)}
            onNext={handleNext}
          />
        )}

        {/* HelpQuestion */}
        {step.helpQuestion &&
          typeof subStep === 'number' &&
          subStep === afterQuestionsStep && (
            <HelpQuestionCard
              key="helpq"
              text={step.helpQuestion.text}
              stepColor={step.color}
              onContinue={handleNext}
            />
          )}

        {/* DecisionTree (ENGINE) */}
        {step.decisionTree &&
          typeof subStep === 'number' &&
          subStep === afterQuestionsStep + (step.helpQuestion ? 1 : 0) && (
            <DecisionTreeCard
              key="dtree"
              nodes={step.decisionTree}
              stepColor={step.color}
              savedValue={stepState.fields['solutionPath'] ?? ''}
              onSelect={(val) => {
                setFieldValue(step.id as StepId, 'solutionPath', val)
                handleNext()
              }}
            />
          )}

        {/* ValidationPaths (TAKEOFF) */}
        {step.validationPaths &&
          typeof subStep === 'number' &&
          subStep >= afterQuestionsStep && (
            <ValidationPathsCard
              key="valpath"
              paths={step.validationPaths}
              stepColor={step.color}
              savedValue={stepState.fields['validationPath'] ?? ''}
              onSelect={(val) => {
                setFieldValue(step.id as StepId, 'validationPath', val)
                handleNext()
              }}
            />
          )}

        {subStep === 'brief' && (
          <FlightBrief
            key="brief"
            step={step}
            onProceed={() => setSubStep('gate')}
          />
        )}

        {subStep === 'gate' && (
          <GateCheck key="gate" step={step} />
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Sub-components ---

function QuestionCard({
  question,
  stepColor,
  savedValue,
  onAnswer,
  onNext,
}: {
  question: Step['questions'][0]
  stepColor: string
  savedValue: string
  onAnswer: (val: string) => void
  onNext: () => void
}) {
  const [value, setValue] = useState(savedValue)
  const canContinue = value.trim().length > 0

  const handleAnswer = (val: string) => {
    setValue(val)
    onAnswer(val)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <p
          className="text-base md:text-lg leading-relaxed font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {question.text}
        </p>
        {question.hint && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {question.hint}
          </p>
        )}
      </div>

      {question.type === 'choice' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                handleAnswer(opt)
                // Auto-advance after a short delay for choices
                setTimeout(onNext, 300)
              }}
              className="text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-150"
              style={{
                borderColor: value === opt ? stepColor : '#3f3f46',
                backgroundColor: value === opt ? `${stepColor}15` : 'var(--bg-surface)',
                color: value === opt ? stepColor : 'var(--text-secondary)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder ?? 'Deine Antwort...'}
            className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: value ? stepColor + '60' : '#3f3f46',
              color: 'var(--text-primary)',
              minHeight: '120px',
            }}
            rows={4}
          />
          <Button
            accentColor={stepColor}
            disabled={!canContinue}
            onClick={onNext}
          >
            Weiter →
          </Button>
        </div>
      )}
    </motion.div>
  )
}

function HelpQuestionCard({
  text,
  stepColor,
  onContinue,
}: {
  text: string
  stepColor: string
  onContinue: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: `${stepColor}30` }}
    >
      <div className="flex items-center gap-2">
        <Lightbulb size={16} style={{ color: stepColor }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: stepColor }}>
          Denkfrage
        </span>
      </div>
      <p className="text-base leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>
        &ldquo;{text}&rdquo;
      </p>
      <Button variant="secondary" accentColor={stepColor} onClick={onContinue}>
        Weiter
      </Button>
    </motion.div>
  )
}

function DecisionTreeCard({
  nodes,
  stepColor,
  savedValue,
  onSelect,
}: {
  nodes: NonNullable<Step['decisionTree']>
  stepColor: string
  savedValue: string
  onSelect: (val: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Welcher Weg passt zu eurem Fall?
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Wähle den Lösungsweg, der eurem Kontext entspricht:
        </p>
      </div>
      <div className="space-y-3">
        {nodes.map((node) => (
          <button
            key={node.path}
            onClick={() => onSelect(node.path)}
            className="w-full text-left rounded-xl border-2 p-4 transition-all duration-150"
            style={{
              borderColor: savedValue === node.path ? node.color : '#3f3f46',
              backgroundColor: savedValue === node.path ? `${node.color}10` : 'var(--bg-surface)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  {node.condition}
                </div>
                <div className="font-semibold text-sm" style={{ color: node.color }}>
                  → {node.path}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {node.note}
                </div>
              </div>
              {node.warning && (
                <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function ValidationPathsCard({
  paths,
  stepColor,
  savedValue,
  onSelect,
}: {
  paths: NonNullable<Step['validationPaths']>
  stepColor: string
  savedValue: string
  onSelect: (val: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Wie wollt ihr euren MVP testen?
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Wähle einen Validierungsweg — unabhängig davon, ob externe Nutzer verfügbar sind:
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {paths.map((path) => (
          <button
            key={path.id}
            onClick={() => onSelect(path.label)}
            className="text-left rounded-xl border-2 px-4 py-4 transition-all duration-150"
            style={{
              borderColor: savedValue === path.label ? stepColor : '#3f3f46',
              backgroundColor: savedValue === path.label ? `${stepColor}15` : 'var(--bg-surface)',
            }}
          >
            <div
              className="font-semibold text-sm mb-1"
              style={{ color: savedValue === path.label ? stepColor : 'var(--text-primary)' }}
            >
              {path.label}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {path.desc}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
