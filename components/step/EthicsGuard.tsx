'use client'

import { Shield, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { EthicsGuard as EthicsGuardType } from '@/lib/steps'
import { Button } from '@/components/ui/Button'

interface Props {
  ethicsGuard: EthicsGuardType
  stepColor: string
  onContinue: () => void
}

export function EthicsGuard({ ethicsGuard, stepColor, onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: `${stepColor}40`,
      }}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: `${stepColor}20`, color: stepColor }}
        >
          <Shield size={12} />
          <span>KI-Leitplanke</span>
        </div>
        <span
          className="text-xs font-semibold"
          style={{ color: stepColor }}
        >
          {ethicsGuard.label}
        </span>
      </div>

      {/* Text */}
      <p
        className="text-base md:text-lg leading-relaxed mb-6"
        style={{ color: 'var(--text-primary)' }}
      >
        {ethicsGuard.text}
      </p>

      {/* Optional link */}
      {ethicsGuard.link && (
        <a
          href={ethicsGuard.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm mb-6 w-fit hover:opacity-80 transition-opacity"
          style={{ color: stepColor }}
        >
          <ExternalLink size={13} />
          {ethicsGuard.linkLabel ?? ethicsGuard.link}
        </a>
      )}

      <Button accentColor={stepColor} onClick={onContinue}>
        Verstanden &amp; Weiter
      </Button>
    </motion.div>
  )
}
