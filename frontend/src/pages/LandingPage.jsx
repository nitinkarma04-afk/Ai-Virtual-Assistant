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
  UserCheck,
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
      title: 'Voice & Wake-Word Control',
      description:
        'Activate your assistant by calling its custom name. Fluid, hands-free voice interaction built directly into your browser.',
      badge: 'Voice Active',
      color: 'cyan',
    },
    {
      icon: Video,
      title: 'Browser & Web Automation',
      description:
        'Ask your assistant to open YouTube, find media, search documentation, or navigate web tools seamlessly.',
      badge: 'Smart Actions',
      color: 'amber',
    },
    {
      icon: Brain,
      title: 'Personal Memory Vault',
      description:
        'Remembers your preferences, coding workflows, projects, and personal notes across sessions with total control.',
      badge: 'Long-Term Memory',
      color: 'violet',
    },
    {
      icon: UserCheck,
      title: 'Custom Persona & Tone',
      description:
        'Tailor your assistant’s name, visual orb persona, and speaking tone to match your exact working style.',
      badge: 'Personalized',
      color: 'emerald',
    },
  ]

  const promptPills = [
    '“Hey Jarvis, play lofi coding beats on YouTube”',
    '“Remember that I prefer React and Tailwind CSS”',
    '“Summarize my daily schedule and open dev environment”',
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Top Header */}
      <Navbar />

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-16 flex flex-col items-center text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="cyan" dot className="px-3.5 py-1 text-xs sm:text-sm">
            Personal AI Companion
          </Badge>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.15]">
          Your Intelligent <br />
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
            AI Companion
          </span>
        </h1>

        {/* Sub-Headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          A personalized, voice-activated virtual assistant tailored to your identity. Execute web
          actions, preserve memory, and streamline your workflow with natural conversation.
        </p>

        {/* Hero Visualizer & Orb */}
        <div className="my-10 sm:my-14 relative flex flex-col items-center justify-center">
          <AIOrb size="xl" color="cyan" state="idle" />

          {/* Interactive Live Status Pill */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl shadow-md dark:shadow-2xl text-xs font-mono text-cyan-700 dark:text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>ASSISTANT STATUS: ONLINE & READY</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-12">
          <Link to={destinationRoute} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="glow"
              icon={Sparkles}
              className="w-full sm:w-auto px-8 text-base shadow-xl"
            >
              {isAuthenticated
                ? hasAssistant
                  ? 'Launch AI Assistant'
                  : 'Set Up Your Assistant'
                : 'Get Started Free'}
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
                Sign In
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
              className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-xs"
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
                className="p-6 flex flex-col justify-between border-slate-200 dark:border-slate-800/80"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={feature.color} className="text-[10px]">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                  <span>Explore feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Security Banner */}
        <div className="mt-16 w-full max-w-4xl p-6 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Private & Secure Memory</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                JWT token-based protection, sanitized storage, and total memory control.
              </p>
            </div>
          </div>

          <Link to={destinationRoute}>
            <Button size="sm" variant="outline" icon={Zap}>
              Get Started
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-200 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Jarvis AI Assistant. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">Privacy</span>
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">Architecture</span>
            <span className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
