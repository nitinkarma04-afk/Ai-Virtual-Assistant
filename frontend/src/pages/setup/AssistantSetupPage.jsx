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
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
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
  const { theme, toggleTheme } = useTheme()

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
    <div
  className="
    min-h-screen
    w-full
    overflow-x-hidden
    bg-slate-50
    dark:bg-slate-950
    text-slate-900
    dark:text-slate-100
    px-3
    py-4
    sm:px-6
    sm:py-8
    flex
    flex-col
    items-center
    selection:bg-cyan-500/30
    selection:text-cyan-800
    dark:selection:text-cyan-200
    transition-colors
    duration-200
  "
>
      {/* Background ambient accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header
  className="
    w-full
    max-w-5xl
    min-w-0
    flex
    flex-col
    gap-4
    sm:flex-row
    sm:items-center
    sm:justify-between
    py-4
    mb-6
    border-b
    border-slate-200
    dark:border-slate-800/80
    relative
    z-10
  "
>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
         <div className="min-w-0">
           <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Set Up Your Assistant</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personalization Wizard</p>
          </div>
        </div>

        <div
  className="
    w-full
    sm:w-auto
    flex
    items-center
    justify-between
    sm:justify-end
    gap-2
    sm:gap-3
    min-w-0
  "
>
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all cursor-pointer shadow-xs"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

         <Badge
  variant="cyan"
  dot
  className="
    text-[10px]
    sm:text-xs
    whitespace-normal
    text-center
    leading-tight
    max-w-[190px]
    sm:max-w-none
  "
>
            Step 1: Personal Identity
          </Badge>
        </div>
      </header>

      {/* Main Grid Content */}
     <main
  className="
    w-full
    max-w-5xl
    min-w-0
    grid
    grid-cols-1
    lg:grid-cols-12
    gap-5
    sm:gap-8
    relative
    z-10
    items-start
  "
>
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 min-w-0 space-y-5 sm:space-y-6">
          <div className="space-y-1">
            <h2
  className="
    text-xl
    sm:text-2xl
    font-bold
    text-slate-900
    dark:text-white
    tracking-tight
    leading-tight
  "
>
              Personalize Your AI Assistant
            </h2>
           <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Welcome, <strong className="text-slate-800 dark:text-slate-200">{user?.name || user?.email}</strong>.
              Choose a name, visual theme, and voice trigger for your AI companion.
            </p>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Assistant Name */}
            <Card
  variant="glass"
  className="p-4 sm:p-5 space-y-4 border-slate-200 dark:border-slate-800"
>
              <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
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
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Section 2: Avatar & Theme */}
            <Card variant="glass" className="p-4 sm:p-5 space-y-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  2. Visual Theme & Orb Style
                </label>
                <span className="text-[11px] text-slate-500">Visual Identity</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 min-w-0">
                {AVATAR_PRESETS.map((avatar) => {
                  const isSelected = selectedAvatar.id === avatar.id
                  return (
                    <div
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2.5 ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-tr ${avatar.gradient} flex items-center justify-center text-white shadow-md relative`}
                      >
                        <Sparkles className="w-4 h-4 text-white/90" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{avatar.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{avatar.colorName}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Section 3: Personality Tone */}
            <Card variant="glass" className="p-4 sm:p-5 space-y-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  3. Conversation Style
                </label>
                <span className="text-[11px] text-slate-500">Tone & Behavior</span>
              </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
                {PERSONALITY_PRESETS.map((persona) => {
                  const isSelected = selectedPersonality.id === persona.id
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersonality(persona)}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1 ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800/90 border-cyan-500/80 shadow-md'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{persona.name}</span>
                        <Badge
                          variant={isSelected ? 'cyan' : 'slate'}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {persona.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Section 4: Wake Word */}
            <Card variant="glass" className="p-4 sm:p-5 space-y-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  4. Voice Activation Phrase
                </label>
                <span className="text-[11px] text-slate-500">Hands-Free Trigger</span>
              </div>

             <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
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
                          ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
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
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
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
                    helperText="Type any custom phrase you would like to speak to wake your assistant."
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
              className="w-full text-base shadow-xl py-3.5"
            >
              Complete Assistant Setup
            </Button>
          </form>
        </div>

        {/* Right Column: Live Preview */}
       <div
  className="
    lg:col-span-5
    w-full
    min-w-0
    lg:sticky
    lg:top-24
    space-y-4
  "
>
          <Card
            variant="glass"
            className="p-6 sm:p-8 flex flex-col items-center text-center border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden"
          >
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {assistantName || 'Your Assistant'}
              </h3>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                {selectedPersonality.name} • {selectedAvatar.name}
              </p>
            </div>

            <div className="mt-6 w-full p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                  <Volume2 className="w-3.5 h-3.5" />
                  PREVIEW VOICE
                </span>
                <span>Active</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                “Hello {user?.name || 'there'}. I am {assistantName || 'your assistant'}. Say{' '}
                <strong className="text-cyan-700 dark:text-cyan-300 font-mono font-normal">“{computedWakeWord}”</strong>{' '}
                whenever you need help.”
              </p>
            </div>

            <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-left text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Wake Phrase:</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-300 text-[11px]">“{computedWakeWord}”</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Personal Memories:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Enabled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Web Automation:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
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
