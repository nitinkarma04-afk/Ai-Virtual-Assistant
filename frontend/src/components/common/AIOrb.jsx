import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '../../utils/cn'

export const AIOrb = ({
  size = 'lg',
  color = 'cyan',
  state = 'idle',
  showCenterIcon = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-24 h-24', core: 'w-12 h-12', icon: 'w-5 h-5' },
    md: { container: 'w-36 h-36', core: 'w-20 h-20', icon: 'w-7 h-7' },
    lg: { container: 'w-56 h-56', core: 'w-32 h-32', icon: 'w-10 h-10' },
    xl: { container: 'w-72 h-72', core: 'w-44 h-44', icon: 'w-14 h-14' },
  }

  const colorMap = {
    cyan: {
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      glow: 'shadow-[0_0_60px_rgba(6,182,212,0.45)]',
      outerRing: 'border-cyan-500/30',
      midRing: 'border-blue-400/40',
      ambient: 'bg-cyan-500/15',
    },
    violet: {
      gradient: 'from-violet-400 via-purple-500 to-pink-600',
      glow: 'shadow-[0_0_60px_rgba(139,92,246,0.45)]',
      outerRing: 'border-violet-500/30',
      midRing: 'border-purple-400/40',
      ambient: 'bg-violet-500/15',
    },
    emerald: {
      gradient: 'from-emerald-300 via-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.45)]',
      outerRing: 'border-emerald-500/30',
      midRing: 'border-teal-400/40',
      ambient: 'bg-emerald-500/15',
    },
    amber: {
      gradient: 'from-amber-300 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_60px_rgba(245,158,11,0.45)]',
      outerRing: 'border-amber-500/30',
      midRing: 'border-orange-400/40',
      ambient: 'bg-amber-500/15',
    },
    rose: {
      gradient: 'from-rose-400 via-pink-500 to-purple-600',
      glow: 'shadow-[0_0_60px_rgba(244,63,94,0.45)]',
      outerRing: 'border-rose-500/30',
      midRing: 'border-pink-400/40',
      ambient: 'bg-rose-500/15',
    },
  }

  const selectedSize = sizeMap[size] || sizeMap.lg
  const selectedColor = colorMap[color] || colorMap.cyan

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none pointer-events-none',
        selectedSize.container,
        className
      )}
    >
      {/* Background radial ambient glow field */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-3xl transition-all duration-700 animate-pulse',
          selectedColor.ambient
        )}
      />

      {/* Outermost rotating dashed energy ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border border-dashed animate-spin transition-all duration-500',
          selectedColor.outerRing
        )}
        style={{ animationDuration: state === 'speaking' ? '8s' : '20s' }}
      />

      {/* Mid counter-rotating orbital ring */}
      <div
        className={cn(
          'absolute inset-4 rounded-full border border-dotted animate-spin transition-all duration-500',
          selectedColor.midRing
        )}
        style={{
          animationDirection: 'reverse',
          animationDuration: state === 'speaking' ? '6s' : '15s',
        }}
      />

      {/* Inner breathing halo */}
      <div
        className={cn(
          'absolute inset-8 rounded-full border border-white/20 transition-all duration-700',
          state === 'listening' ? 'scale-110 opacity-80' : 'scale-100 opacity-40'
        )}
      />

      {/* Core Plasma Sphere */}
      <div
        className={cn(
          'relative rounded-full bg-gradient-to-tr flex items-center justify-center text-white transition-all duration-500',
          selectedSize.core,
          selectedColor.gradient,
          selectedColor.glow,
          state === 'listening' && 'scale-105',
          state === 'speaking' && 'animate-pulse'
        )}
      >
        {/* Core highlight flare */}
        <div className="absolute top-2 left-3 w-4 h-2 rounded-full bg-white/40 blur-xs" />

        {showCenterIcon && (
          <Sparkles className={cn(selectedSize.icon, 'drop-shadow-md text-white/90 animate-pulse')} />
        )}
      </div>
    </div>
  )
}

export default AIOrb

