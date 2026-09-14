import React, { useState } from 'react'
import { X, Loader2, Brain, Sparkles } from 'lucide-react'
import { Button } from '../common/Button'

export const AddMemoryModal = ({ isOpen, onClose, onAdd, isAdding }) => {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    if (!key.trim() || !value.trim()) {
      setValidationError('Both Memory Topic/Key and Fact/Value are required.')
      return
    }

    onAdd({ key: key.trim(), value: value.trim() })
    setKey('')
    setValue('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Add Memory Fact</h3>
              <p className="text-xs text-slate-400 font-mono">Store new persistent assistant knowledge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAdding}
            className="p-1 text-slate-500 hover:text-white transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {validationError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              Memory Key / Topic <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. user_favorite_language, location, work_role"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
            />
            <span className="text-[11px] text-slate-500 block">
              Spaces will automatically be formatted as underscores (e.g. "favorite color" → "favorite_color").
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              Memory Value / Fact <span className="text-cyan-400">*</span>
            </label>
            <textarea
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Prefers TypeScript and React, works in San Francisco."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={isAdding}
              className="text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="glow"
              size="sm"
              type="submit"
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Save Memory
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMemoryModal

