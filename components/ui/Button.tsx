'use client'

import { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  accentColor?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  accentColor,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const baseStyle: React.CSSProperties = {}
  const variantClasses: Record<string, string> = {
    primary: 'text-white font-medium rounded-xl transition-all duration-200',
    secondary:
      'border font-medium rounded-xl transition-all duration-200',
    ghost: 'font-medium rounded-xl transition-all duration-200',
  }

  if (variant === 'primary') {
    baseStyle.backgroundColor = accentColor ?? '#3B82F6'
    baseStyle.opacity = disabled ? 0.4 : 1
  } else if (variant === 'secondary') {
    baseStyle.borderColor = accentColor ?? '#3f3f46'
    baseStyle.color = accentColor ?? 'var(--text-secondary)'
    baseStyle.backgroundColor = 'transparent'
  } else {
    baseStyle.color = accentColor ?? 'var(--text-secondary)'
    baseStyle.backgroundColor = 'transparent'
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={baseStyle}
      {...(props as object)}
    >
      {children}
    </motion.button>
  )
}
