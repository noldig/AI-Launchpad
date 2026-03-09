'use client'

import { useState, useRef } from 'react'
import { Pencil, Check } from 'lucide-react'
import { useLaunchpadStore } from '@/lib/store'

export function ProjectNameInput() {
  const { projectName, setProjectName } = useLaunchpadStore()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(projectName)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleStartEdit = () => {
    setValue(projectName)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed) setProjectName(trimmed)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Projektname eingeben..."
          className="bg-elevated border border-zinc-600 rounded-lg px-3 py-1.5 text-sm text-primary focus:outline-none focus:border-zinc-400 w-48 md:w-64"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={handleSave}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Speichern"
        >
          <Check size={16} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleStartEdit}
      className="flex items-center gap-1.5 text-sm transition-colors group"
      style={{ color: projectName ? 'var(--text-primary)' : 'var(--text-muted)' }}
      aria-label="Projektnamen bearbeiten"
    >
      <Pencil
        size={13}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-secondary)' }}
      />
      <span className="font-medium">
        {projectName || 'Projektname eingeben...'}
      </span>
    </button>
  )
}
