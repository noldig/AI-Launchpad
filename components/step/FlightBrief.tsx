'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Check, Plane } from 'lucide-react'
import { Step, StepId } from '@/lib/steps'
import { useLaunchpadStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'

interface Props {
  step: Step
  onProceed: () => void
}

export function FlightBrief({ step, onProceed }: Props) {
  const { steps, setFieldValue } = useLaunchpadStore()
  const fields = steps[step.id as StepId].fields
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const allFilled = step.brief.every((f) => fields[f.key]?.trim())

  const startEdit = (key: string, currentVal: string) => {
    setEditingKey(key)
    setEditValue(currentVal)
  }

  const saveEdit = (key: string) => {
    setFieldValue(step.id as StepId, key, editValue)
    setEditingKey(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Dein Flight Brief
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Überprüfe und ergänze die Angaben. Alle Felder müssen ausgefüllt sein.
        </p>
      </div>

      {/* Ticket card */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: `${step.color}40` }}
      >
        {/* Ticket header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: step.color }}
        >
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-white" />
            <span className="text-white font-display font-bold text-sm tracking-widest uppercase">
              Flight Brief
            </span>
          </div>
          <span className="text-white/80 text-xs font-mono uppercase tracking-widest">
            {step.title}
          </span>
        </div>

        {/* Dashed divider */}
        <div
          className="mx-4 border-t-2 border-dashed"
          style={{ borderColor: `${step.color}30` }}
        />

        {/* Fields */}
        <div
          className="px-6 py-5 space-y-5"
          style={{ backgroundColor: 'var(--bg-elevated)' }}
        >
          {step.brief.map((field, i) => {
            const val = fields[field.key] ?? ''
            const isEmpty = !val.trim()
            const isEditing = editingKey === field.key

            return (
              <div key={field.key}>
                {i > 0 && (
                  <div
                    className="mb-5 border-t"
                    style={{ borderColor: '#2d2d3e' }}
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-mono uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {field.label}
                    </div>

                    {isEditing ? (
                      field.type === 'choice' ? (
                        <div className="flex flex-wrap gap-2">
                          {field.options?.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setEditValue(opt)
                                saveEdit(field.key)
                              }}
                              className="px-3 py-1 rounded-lg text-sm border transition-all"
                              style={{
                                borderColor: editValue === opt ? step.color : '#3f3f46',
                                color: editValue === opt ? step.color : 'var(--text-secondary)',
                                backgroundColor:
                                  editValue === opt ? `${step.color}15` : 'transparent',
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none"
                            style={{
                              backgroundColor: 'var(--bg-surface)',
                              borderColor: step.color + '60',
                              color: 'var(--text-primary)',
                              minHeight: '72px',
                            }}
                            rows={3}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                saveEdit(field.key)
                              }
                            }}
                          />
                          <button
                            onClick={() => saveEdit(field.key)}
                            className="mt-2 rounded-full p-1.5 transition-colors"
                            style={{ backgroundColor: step.color }}
                            aria-label="Speichern"
                          >
                            <Check size={13} className="text-white" />
                          </button>
                        </div>
                      )
                    ) : (
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: isEmpty ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontStyle: isEmpty ? 'italic' : 'normal',
                        }}
                      >
                        {isEmpty ? 'Nicht ausgefüllt — klicke zum Bearbeiten' : val}
                      </p>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => startEdit(field.key, val)}
                      className="shrink-0 mt-0.5 opacity-40 hover:opacity-100 transition-opacity"
                      aria-label={`${field.label} bearbeiten`}
                    >
                      <Pencil size={14} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {!allFilled && (
        <p className="text-xs" style={{ color: '#EF4444' }}>
          Bitte fülle alle Felder aus, bevor du zum Gate Check weitergehst.
        </p>
      )}

      <Button
        accentColor={step.color}
        disabled={!allFilled}
        onClick={onProceed}
        size="lg"
      >
        Zum Gate Check →
      </Button>
    </motion.div>
  )
}
