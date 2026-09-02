import React from 'react'
import { cn } from '../../utils/cn'

export const Badge = ({
  children,
  variant = 'cyan',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  }

  const dotColors = {
    cyan: 'bg-cyan-400 animate-pulse',
    violet: 'bg-violet-400 animate-pulse',
    emerald: 'bg-emerald-400 animate-pulse',
    amber: 'bg-amber-400 animate-pulse',
    rose: 'bg-rose-400 animate-pulse',
    slate: 'bg-slate-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wide select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}

export default Badge
