import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sliders,
  ArrowLeft,
  Bot,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Loader2,
  Image,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { userService, getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export const SettingsPage = () => {
  const { user, assistant, setAssistantConfig } = useAuth()

  const [assistantName, setAssistantName] = useState(() => assistant?.name || assistant?.assistantName || 'My Assistant')
  const [assistantImage, setAssistantImage] = useState(() => assistant?.image || assistant?.assistantImage || '')
  const [voiceSpeed, setVoiceSpeed] = useState('1.0')
  const [wakeWordSensitivity, setWakeWordSensitivity] = useState('High')

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Auto-dismiss success notification
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Save Assistant Settings to real backend API `PUT /api/user/assistant`
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    if (!assistantName.trim()) {
      setError('Assistant name cannot be empty.')
      setIsSaving(false)
      return
    }

    try {
      const res = await userService.updateAssistant({
        assistantName: assistantName.trim(),
        assistantImage: assistantImage.trim(),
      })

      if (res?.assistant) {
        setAssistantConfig({
          ...assistant,
          name: res.assistant.name || assistantName.trim(),
          assistantName: res.assistant.name || assistantName.trim(),
          image: res.assistant.image || assistantImage.trim(),
          assistantImage: res.assistant.image || assistantImage.trim(),
        })
      }
      setSuccessMessage('Settings saved successfully!')
    } catch (err) {
      console.error('Failed to update assistant settings:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-400/30 dark:focus:ring-cyan-500/30 transition-all'

  const selectClass =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-400/30 dark:focus:ring-cyan-500/30 font-mono'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 relative overflow-x-hidden transition-colors duration-200">
      {/* Background Ambient Lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="Return to Dashboard"
              >
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  Settings
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Assistant & Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" dot className="text-[10px] py-0.5">
                Configuration
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Assistant & System Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Customize your assistant's name, avatar, and voice preferences.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-rose-700 dark:text-rose-200">Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Assistant Identity */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Assistant Identity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Saved to your account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300">
                  Assistant Name <span className="text-cyan-500 dark:text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g. Jarvis, Athena, Max"
                  className={`${inputClass} font-sans`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  Assistant Avatar URL
                </label>
                <input
                  type="text"
                  value={assistantImage}
                  onChange={(e) => setAssistantImage(e.target.value)}
                  placeholder="e.g. https://example.com/avatar.png"
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Voice Controls */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Voice & Audio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Browser speech synthesis & microphone</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300">Speech Playback Speed</label>
                <select
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(e.target.value)}
                  className={selectClass}
                >
                  <option value="0.8">0.8x (Slower)</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.2">1.2x (Faster)</option>
                  <option value="1.5">1.5x (Fast)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-300">Wake Word Sensitivity</label>
                <select
                  value={wakeWordSensitivity}
                  onChange={(e) => setWakeWordSensitivity(e.target.value)}
                  className={selectClass}
                >
                  <option value="Low">Low (Fewer triggers)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="High">High (Responsive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Account Information */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Account Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your authenticated account details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 block">Name</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{user?.name || 'N/A'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 block">Email</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end">
            <Button variant="glow" type="submit" disabled={isSaving} icon={isSaving ? Loader2 : Save}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-600 font-mono border-t border-slate-200 dark:border-slate-900 mt-12 relative z-10">
        Settings
      </footer>
    </div>
  )
}

export default SettingsPage
