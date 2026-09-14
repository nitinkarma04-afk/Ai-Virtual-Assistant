import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Mic,
  Zap,
  Brain,
  Video,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Radio,
} from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { AIOrb } from '../components/common/AIOrb'
import { useAuth } from '../hooks/useAuth'

export const LandingPage = () => {
  const { isAuthenticated, hasAssistant } = useAuth()

  const destinationRoute = isAuthenticated
    ? hasAssistant
      ? '/dashboard'
      : '/assistant-setup'
    : '/signup'

  const features = [
    {
      icon: Mic,
      title: 'Voice & Wake-Word Activation',
      description:
        'Wake your assistant by simply calling its custom name. Fluid, hands-free voice interaction built directly into your browser.',
      badge: 'Voice Core',
      color: 'cyan',
    },
    {
      icon: Video,
      title: 'Automated Browser Actions',
      description:
        'Ask your assistant to open YouTube, find music, search documentation, or execute tasks across the web automatically.',
      badge: 'Action Engine',
      color: 'amber',
    },
    {
      icon: Brain,
      title: 'Persistent Memory Vault',
      description:
        'Remembers your preferences, coding workflows, projects, and personal notes across sessions with total user control.',
      badge: 'Long-Term Memory',
      color: 'violet',
    },
    {
      icon: Cpu,
      title: 'Personalized Identity',
      description:
        'Choose your assistant’s name, visual avatar persona, and speaking tone to match your exact working style.',
      badge: 'Custom Persona',
      color: 'emerald',
    },
  ]

  const promptPills = [
    '“Hey Jarvis, play lofi coding beats on YouTube”',
    '“Remember my preferred React component structure”',
    '“Summarize today’s tasks and launch dev tools”',
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Floating Glass Header */}
      <Navbar />

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-16 flex flex-col items-center text-center">
        {/* Ambient Top Tag */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="cyan" dot className="px-3.5 py-1 text-xs sm:text-sm">
            Next-Gen Personal AI Architecture
          </Badge>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Your Intelligent <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Neural Companion
          </span>
        </h1>

        {/* Sub-Headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          A personalized, voice-activated AI assistant tailored to your identity. Execute browser
          actions, preserve persistent memory, and streamline your workflow with natural voice
          intelligence.
        </p>

        {/* Hero Interactive Visualizer & Glowing Orb */}
        <div className="my-10 sm:my-14 relative flex flex-col items-center justify-center">
          <AIOrb size="xl" color="cyan" state="idle" />

          {/* Interactive Live Status Pill Floating beneath Orb */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl text-xs font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEURAL MATRIX: READY FOR CALIBRATION</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-12">
          <Link to={destinationRoute} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="glow"
              icon={Sparkles}
              className="w-full sm:w-auto px-8 text-base shadow-2xl"
            >
              {isAuthenticated
                ? hasAssistant
                  ? 'Launch AI Dashboard'
                  : 'Complete Assistant Setup'
                : 'Configure Your Assistant'}
            </Button>
          </Link>

          {!isAuthenticated && (
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="glass"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto px-7 text-base"
              >
                Sign In to Account
              </Button>
            </Link>
          )}
        </div>

        {/* Prompt Showcase Pills */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-2.5 mb-16">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono mr-1">
            Try Asking:
          </span>
          {promptPills.map((prompt, index) => (
            <span
              key={index}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 hover:border-cyan-500/30 transition-colors"
            >
              {prompt}
            </span>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                variant="glass"
                hover
                className="p-6 flex flex-col justify-between border-slate-800/80 hover:border-cyan-500/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={feature.color} className="text-[10px]">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                  <span>Explore capability</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Security & Reliability Trust Banner */}
        <div className="mt-16 w-full max-w-4xl p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Private & Secure by Design</h4>
              <p className="text-xs text-slate-400">
                JWT token-based protection, sanitized storage, and full memory controls.
              </p>
            </div>
          </div>

          <Link to={destinationRoute}>
            <Button size="sm" variant="outline" icon={Zap}>
              Start Now
            </Button>
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 NeuralCore AI. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-cyan-400 cursor-pointer">Privacy</span>
            <span className="hover:text-cyan-400 cursor-pointer">Architecture</span>
            <span className="hover:text-cyan-400 cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
