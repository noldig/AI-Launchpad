'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plane, BookOpen } from 'lucide-react'
import { Step } from '@/lib/steps'
import { QuestionFlow } from './QuestionFlow'
import { ProjectNameInput } from '@/components/ui/ProjectNameInput'

interface Props {
  step: Step
}

export function StepPage({ step }: Props) {
  return (
    <motion.div
      layoutId={`step-${step.id}`}
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Sticky Header */}
      <header
        className="flex items-center justify-between px-4 md:px-6 py-4 border-b sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: '#1f1f2e',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Zurück zur Übersicht"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Übersicht</span>
          </Link>
          <span style={{ color: '#2d2d3e' }}>|</span>
          <div className="flex items-center gap-2">
            <Plane size={16} style={{ color: '#6366f1' }} />
            <span
              className="font-display font-bold text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              AI Launchpad
            </span>
          </div>
        </div>

        <ProjectNameInput />

        <Link
          href="/glossar"
          className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Glossar"
        >
          <BookOpen size={16} />
          <span className="hidden md:inline">Glossar</span>
        </Link>
      </header>

      {/* Step Header */}
      <div
        className="px-4 md:px-6 py-8 md:py-10 border-b"
        style={{
          borderColor: '#1f1f2e',
          background: `linear-gradient(135deg, ${step.color}08 0%, transparent 60%)`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">{step.emoji}</span>
            <h1
              className="font-display font-bold text-2xl md:text-3xl"
              style={{ color: step.color }}
            >
              {step.title}
            </h1>
          </div>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            {step.tagline}
          </p>
        </div>
      </div>

      {/* Question Flow */}
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <QuestionFlow step={step} />
      </main>
    </motion.div>
  )
}
