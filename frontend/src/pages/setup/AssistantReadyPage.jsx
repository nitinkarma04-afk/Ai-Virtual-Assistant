import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic,
  CheckCircle2,
  Video,
  Brain,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { AIOrb } from '../../components/common/AIOrb'

export const AssistantReadyPage = () => {
  const navigate = useNavigate()
  const { user, assistant } = useAuth()

  const name = assistant?.name || assistant?.assistantName || 'Your Assistant'
  const wakeWord = assistant?.wakeWord || `Hey ${name}`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6 text-center">
        {/* Celebration Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>CALIBRATION COMPLETE • SYSTEM ONLINE</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet <span className="text-cyan-400">{name}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Your personal neural assistant is fully calibrated and linked to your account,{' '}
            <strong className="text-slate-200">{user?.name || user?.email}</strong>.
          </p>
        </div>

        {/* Visualized Assistant Card */}
        <Card variant="glow" className="p-8 space-y-6 border-slate-800 backdrop-blur-2xl">
          <div className="flex flex-col items-center justify-center">
            <AIOrb size="lg" color="cyan" state="idle" />
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="cyan" dot className="text-xs">
                Active & Listening
              </Badge>
              <Badge variant="violet" className="text-xs">
                {assistant?.personalityName || 'Helpful & Balanced'}
              </Badge>
            </div>
          </div>

          {/* Wake Word Instruction Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Your Voice Wake Trigger</div>
                <div className="text-base font-bold text-cyan-300 font-mono">“{wakeWord}”</div>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 italic">Hands-free ready</span>
          </div>

          {/* Quick Capability Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <Mic className="w-3.5 h-3.5" />
                <span>Voice & Text</span>
              </div>
              <p className="text-[11px] text-slate-400">Real-time speech recognition & synthesis.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Video className="w-3.5 h-3.5" />
                <span>Actions Engine</span>
              </div>
              <p className="text-[11px] text-slate-400">Opens YouTube, web search, and tools.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                <Brain className="w-3.5 h-3.5" />
                <span>Memory Vault</span>
              </div>
              <p className="text-[11px] text-slate-400">Learns your preferences over time.</p>
            </div>
          </div>

          {/* Enter Dashboard CTA */}
          <Button
            size="lg"
            variant="glow"
            icon={LayoutDashboard}
            iconPosition="right"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="w-full text-base py-3.5 shadow-2xl shadow-cyan-500/25 mt-4"
          >
            Launch Command Center
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default AssistantReadyPage

