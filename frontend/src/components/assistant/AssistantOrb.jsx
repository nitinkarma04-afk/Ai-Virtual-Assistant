import React from 'react'
import { Sparkles, Mic, Brain, Volume2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export const AssistantOrb = ({
  state = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  className = '',
}) => {
  const stateConfig = {
    idle: {
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.35)]',
      outerRing: 'border-cyan-500/30 animate-spin',
      ringSpeed: '24s',
      ambientBg: 'bg-cyan-500/10',
      icon: Sparkles,
      iconColor: 'text-white/90',
    },
    listening: {
      color: 'from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.5)]',
      outerRing: 'border-emerald-400/50 animate-spin',
      ringSpeed: '8s',
      ambientBg: 'bg-emerald-500/20',
      icon: Mic,
      iconColor: 'text-white',
    },
    thinking: {
      color: 'from-violet-400 via-purple-500 to-indigo-600',
      glow: 'shadow-[0_0_60px_rgba(139,92,246,0.5)]',
      outerRing: 'border-violet-400/60 animate-spin',
      ringSpeed: '4s',
      ambientBg: 'bg-violet-500/20',
      icon: Brain,
      iconColor: 'text-white',
    },
    speaking: {
      color: 'from-cyan-400 via-teal-400 to-blue-600',
      glow: 'shadow-[0_0_60px_rgba(6,182,212,0.5)]',
      outerRing: 'border-cyan-400/60 animate-spin',
      ringSpeed: '6s',
      ambientBg: 'bg-cyan-500/25',
      icon: Volume2,
      iconColor: 'text-white',
    },
  }

  const current = stateConfig[state] || stateConfig.idle
  const Icon = current.icon

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none w-32 h-32 sm:w-40 sm:h-40 pointer-events-none',
        className
      )}
    >
      {/* Background ambient aura field */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-3xl transition-all duration-700 animate-pulse',
          current.ambientBg
        )}
      />

      {/* Outer rotating dashed ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full border border-dashed transition-all duration-500',
          current.outerRing
        )}
        style={{ animationDuration: current.ringSpeed }}
      />

      {/* Mid counter-rotating orbital ring */}
      <div
        className={cn(
          'absolute inset-3 rounded-full border border-dotted animate-spin transition-all duration-500 opacity-60',
          state === 'thinking' ? 'border-violet-400/80' : 'border-cyan-400/40'
        )}
        style={{
          animationDirection: 'reverse',
          animationDuration: state === 'thinking' ? '3s' : '12s',
        }}
      />

      {/* Reactive expanding pulse ring when listening or speaking */}
      {(state === 'listening' || state === 'speaking') && (
        <div className="absolute inset-1 rounded-full border-2 border-cyan-400/40 animate-ping opacity-30" />
      )}

      {/* Core Plasma Sphere */}
      <div
        className={cn(
          'relative rounded-full bg-gradient-to-tr flex items-center justify-center text-white transition-all duration-500',
          'w-20 h-20 sm:w-24 sm:h-24',
          current.color,
          current.glow,
          state === 'listening' && 'scale-110',
          state === 'thinking' && 'scale-105 animate-pulse',
          state === 'speaking' && 'animate-pulse scale-105'
        )}
      >
        {/* Sphere 3D highlight glow */}
        <div className="absolute top-2 left-3 w-5 h-2.5 rounded-full bg-white/40 blur-xs" />
        <Icon className={cn('w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md animate-pulse', current.iconColor)} />
      </div>
    </div>
  )
}

export default AssistantOrb
