import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Bot,
  Radio,
  Volume2,
  Check,
  ArrowRight,
  Sliders,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { assistantService, getErrorMessage } from '../../services/api'
import {
  ASSISTANT_NAME_PRESETS,
  AVATAR_PRESETS,
  PERSONALITY_PRESETS,
  WAKE_WORD_TEMPLATES,
} from '../../utils/constants'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { AIOrb } from '../../components/common/AIOrb'

export const AssistantSetupPage = () => {
  const navigate = useNavigate()
  const { user, assistant: existingAssistant, setAssistantConfig } = useAuth()

  const [assistantName, setAssistantName] = useState(
    existingAssistant?.name || existingAssistant?.assistantName || 'Jarvis'
  )
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATAR_PRESETS.find((a) => a.id === existingAssistant?.avatarId) || AVATAR_PRESETS[0]
  )
  const [selectedPersonality, setSelectedPersonality] = useState(
    PERSONALITY_PRESETS.find((p) => p.id === existingAssistant?.personality) || PERSONALITY_PRESETS[0]
  )
  const [selectedWakeWordTemplate, setSelectedWakeWordTemplate] = useState(
    existingAssistant?.wakeWordTemplate || WAKE_WORD_TEMPLATES[0]
  )

  const [customWakeWord, setCustomWakeWord] = useState('')
  const [useCustomWakeWord, setUseCustomWakeWord] = useState(false)
  const [nameError, setNameError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const computedWakeWord = useCustomWakeWord
    ? customWakeWord.trim() || `Hey ${assistantName}`
    : selectedWakeWordTemplate.replace('{name}', assistantName || 'Assistant')

  const handleNamePreset = (name) => {
    setAssistantName(name)
    setNameError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!assistantName.trim()) {
      setNameError('Please provide a name for your assistant')
      return
    }

    setIsSubmitting(true)
    const assistantPayload = {
      name: assistantName.trim(),
      assistantName: assistantName.trim(),
      avatarId: selectedAvatar.id,
      avatarName: selectedAvatar.name,
      avatarColor: selectedAvatar.accent,
      personality: selectedPersonality.id,
      personalityName: selectedPersonality.name,
      wakeWord: computedWakeWord,
      wakeWordTemplate: selectedWakeWordTemplate,
      configuredAt: new Date().toISOString(),
    }

    try {
      try {
        await assistantService.setupAssistant(assistantPayload)
      } catch (apiErr) {
        console.warn('Backend assistant sync notice:', apiErr.message)
      }

      setAssistantConfig(assistantPayload)
      navigate('/assistant-ready', { replace: true })
    } catch (err) {
      console.error('Setup error:', err)
      setServerError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 mb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Neural Calibration</h1>
            <p className="text-xs text-slate-400">Personal AI Setup Wizard</p>
          </div>
        </div>

        <Badge variant="cyan" dot className="text-xs">
          Step 1 of 2: Identity Setup
        </Badge>
      </header>

      {/* Main Grid Content */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* Left Column: Interactive Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Calibrate Your Personal Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Welcome, <strong className="text-slate-200">{user?.name || user?.email}</strong>.
              Customize your assistant’s identity, persona, and trigger settings below.
            </p>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Assistant Name */}
            <Card variant="glass" className="p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  1. Assistant Name
                </label>
                <span className="text-[11px] text-slate-500">Pick or type custom</span>
              </div>

              <Input
                placeholder="e.g. Jarvis, Aria, Nova..."
                value={assistantName}
                onChange={(e) => {
                  setAssistantName(e.target.value)
                  if (nameError) setNameError('')
                }}
                error={nameError}
                required
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1">Popular:</span>
                {ASSISTANT_NAME_PRESETS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleNamePreset(name)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      assistantName.toLowerCase() === name.toLowerCase()
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-slate-200 hover:bg-slate-700/80'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Section 2: Avatar & Color Theme */}
            <Card variant="glass" className="p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  2. Visual Avatar Persona
                </label>
                <span className="text-[11px] text-slate-500">Reactive Orb Theme</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((avatar) => {
                  const isSelected = selectedAvatar.id === avatar.id
                  return (
                    <div
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2.5 ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400/80 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/50'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Avatar preview ring */}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-tr ${avatar.gradient} flex items-center justify-center text-white shadow-md relative`}
                      >
                        <Sparkles className="w-5 h-5 text-white/90" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{avatar.name}</div>
                        <div className="text-[10px] text-slate-400">{avatar.colorName}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Section 3: Personality Tone */}
            <Card variant="glass" className="p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  3. Conversation Tone & Persona
                </label>
                <span className="text-[11px] text-slate-500">Response Style</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONALITY_PRESETS.map((persona) => {
                  const isSelected = selectedPersonality.id === persona.id
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersonality(persona)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1 ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{persona.name}</span>
                        <Badge
                          variant={isSelected ? 'cyan' : 'slate'}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {persona.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Section 4: Wake-Word Trigger */}
            <Card variant="glass" className="p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  4. Activation Wake-Word
                </label>
                <span className="text-[11px] text-slate-500">Voice Trigger</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {WAKE_WORD_TEMPLATES.map((tmpl) => {
                  const label = tmpl.replace('{name}', assistantName || 'Assistant')
                  const isSelected = !useCustomWakeWord && selectedWakeWordTemplate === tmpl
                  return (
                    <button
                      key={tmpl}
                      type="button"
                      onClick={() => {
                        setSelectedWakeWordTemplate(tmpl)
                        setUseCustomWakeWord(false)
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      “{label}”
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => setUseCustomWakeWord(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    useCustomWakeWord
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Custom Phrase...
                </button>
              </div>

              {useCustomWakeWord && (
                <div className="pt-2">
                  <Input
                    placeholder={`e.g. Wake up ${assistantName || 'Jarvis'}`}
                    value={customWakeWord}
                    onChange={(e) => setCustomWakeWord(e.target.value)}
                    helperText="Type any custom wake phrase you would like to speak to trigger your assistant."
                  />
                </div>
              )}
            </Card>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full text-base shadow-2xl py-3.5"
            >
              Calibrate & Activate Assistant
            </Button>
          </form>
        </div>

        {/* Right Column: Live Real-Time Assistant Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <Card
            variant="glass"
            className="p-6 sm:p-8 flex flex-col items-center text-center border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div
              className={`absolute -top-16 inset-x-0 h-44 ${selectedAvatar.bgGlow} blur-3xl pointer-events-none`}
            />

            <Badge variant="cyan" dot className="mb-4 text-xs font-mono">
              LIVE PREVIEW
            </Badge>

            <div className="my-4">
              <AIOrb
                size="md"
                color={
                  selectedAvatar.id === 'quantum-pulse'
                    ? 'violet'
                    : selectedAvatar.id === 'cyber-matrix'
                    ? 'emerald'
                    : selectedAvatar.id === 'solar-flare'
                    ? 'amber'
                    : selectedAvatar.id === 'crimson-nova'
                    ? 'rose'
                    : 'cyan'
                }
                state="idle"
              />
            </div>

            <div className="space-y-1.5 mt-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {assistantName || 'Your Assistant'}
              </h3>
              <p className="text-xs text-cyan-400 font-medium">
                {selectedPersonality.name} • {selectedAvatar.name}
              </p>
            </div>

            <div className="mt-6 w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Volume2 className="w-3.5 h-3.5" />
                  INITIAL RESPONSE
                </span>
                <span>Active</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                “Hello {user?.name || 'there'}. I am {assistantName || 'your assistant'}. Say{' '}
                <strong className="text-cyan-300 font-mono font-normal">“{computedWakeWord}”</strong>{' '}
                whenever you need me.”
              </p>
            </div>

            <div className="mt-6 w-full pt-4 border-t border-slate-800/80 space-y-2 text-left text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Wake Phrase:</span>
                <span className="font-mono text-cyan-300 text-[11px]">“{computedWakeWord}”</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Memory Vault:</span>
                <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Enabled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Browser Actions:</span>
                <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AssistantSetupPage
