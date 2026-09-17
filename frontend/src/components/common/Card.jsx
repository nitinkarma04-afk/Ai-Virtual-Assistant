import React from 'react'
import { cn } from '../../utils/cn'

export const Card = ({
  children,
  variant = 'glass',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden'

  const variantStyles = {
    glass:
      'bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl',
    solid: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl',
    glow: 'bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/20 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10',
    interactive:
      'bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/40 hover:shadow-cyan-500/10 hover:shadow-lg cursor-pointer',
  }

  const hoverStyles = hover
    ? 'hover:border-cyan-500/40 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200'
    : ''

  return (
    <div className={cn(baseStyles, variantStyles[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  )
}

export default Card
