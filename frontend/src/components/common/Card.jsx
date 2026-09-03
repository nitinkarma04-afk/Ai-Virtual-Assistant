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
    glass: 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl',
    solid: 'bg-slate-900 border border-slate-800 shadow-xl',
    glow: 'bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10',
    interactive:
      'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-cyan-500/10 hover:shadow-xl cursor-pointer',
  }

  const hoverStyles = hover
    ? 'hover:border-cyan-500/40 hover:-translate-y-0.5 hover:shadow-2xl transition-transform duration-200'
    : ''

  return (
    <div className={cn(baseStyles, variantStyles[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  )
}

export default Card

