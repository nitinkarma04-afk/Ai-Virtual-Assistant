import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { memoryService, getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { MemoryCard } from '../../components/memory/MemoryCard'
import { MemorySkeleton } from '../../components/memory/MemorySkeleton'
import { MemoryEmptyState } from '../../components/memory/MemoryEmptyState'
import { AddMemoryModal } from '../../components/memory/AddMemoryModal'

export const MemoryVaultPage = () => {
  const { assistant } = useAuth()
  const assistantName = assistant?.name || assistant?.assistantName || 'Neural Assistant'

  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Add memory modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Delete confirmation state
  const [memoryToDelete, setMemoryToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch memories from backend
  const fetchMemories = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const data = await memoryService.getMemories()
      const list = data?.memories || (Array.isArray(data) ? data : [])
      setMemories(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to load memories:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    memoryService
      .getMemories()
      .then((data) => {
        if (!isMounted) return
        const list = data?.memories || (Array.isArray(data) ? data : [])
        setMemories(Array.isArray(list) ? list : [])
      })
      .catch((err) => {
        if (!isMounted) return
        setError(getErrorMessage(err))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-dismiss success notification
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Filter memories based on search query
  const filteredMemories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return memories

    return memories.filter((m) => {
      const keyStr = (m.key || '').toLowerCase()
      const valStr = (m.value || '').toLowerCase()
      return keyStr.includes(query) || valStr.includes(query)
    })
  }, [memories, searchQuery])

  // Handle adding a memory
  const handleAddMemory = async (newMemoryData) => {
    setIsAdding(true)
    setError(null)
    try {
      const res = await memoryService.createMemory(newMemoryData)
      if (res?.memory) {
        setMemories((prev) => {
          const filtered = prev.filter((item) => item.key !== res.memory.key)
          return [res.memory, ...filtered]
        })
      } else {
        await fetchMemories(false)
      }
      setSuccessMessage('Memory fact saved successfully!')
      setIsAddModalOpen(false)
    } catch (err) {
      console.error('Failed to save memory:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsAdding(false)
    }
  }

  // Handle deleting a memory
  const handleConfirmDelete = async () => {
    if (!memoryToDelete) return
    setIsDeleting(true)
    setError(null)
    try {
      await memoryService.deleteMemory(memoryToDelete.key)
      setMemories((prev) => prev.filter((m) => m.key !== memoryToDelete.key))
      setSuccessMessage(`Memory for "${memoryToDelete.key}" deleted successfully.`)
      setMemoryToDelete(null)
    } catch (err) {
      console.error('Failed to delete memory:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background Ambient Lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header / Navigation Bar */}
      <header className="w-full px-4 sm:px-6 py-4 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                className="text-slate-400 hover:text-white"
                title="Return to Dashboard"
              >
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  Memory Vault
                </h1>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {memories.length} {memories.length === 1 ? 'stored fact' : 'stored facts'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchMemories(true)}
              disabled={isLoading}
              title="Refresh memories"
              className="text-slate-400 hover:text-cyan-300"
            />

            <Button
              variant="glow"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              <span className="hidden sm:inline">Add Memory</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
        {/* Page Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" dot className="text-[10px] py-0.5">
                Long-Term Knowledge
              </Badge>
              <span className="text-xs text-slate-500 font-mono">• {assistantName}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Stored Knowledge & Preferences</h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Knowledge extracted automatically during chat or added manually. Your assistant uses these persistent facts to personalize responses.
            </p>
          </div>
        </div>

        {/* Notifications (Success & Error) */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-rose-200 font-sans">Operation Error</strong>
              <span>{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => fetchMemories(true)} className="text-rose-300 hover:text-white">
              Retry
            </Button>
          </div>
        )}

        {/* Search & Filter Bar */}
        {(memories.length > 0 || searchQuery) && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories by topic key or stored value..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Content State Switch */}
        {isLoading ? (
          <MemorySkeleton />
        ) : memories.length === 0 ? (
          <MemoryEmptyState onAddClick={() => setIsAddModalOpen(true)} />
        ) : filteredMemories.length === 0 ? (
          <MemoryEmptyState isSearch onResetSearch={() => setSearchQuery('')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((memory, idx) => (
              <MemoryCard
                key={memory._id || memory.key || `mem-${idx}`}
                memory={memory}
                onDelete={(mem) => setMemoryToDelete(mem)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-slate-600 font-mono border-t border-slate-900 mt-12 relative z-10">
        Memory Vault Repository • {assistantName}
      </footer>

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMemory}
        isAdding={isAdding}
      />

      {/* Delete Confirmation Modal */}
      {memoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Delete Memory Entry?</h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete the memory fact for <strong className="text-cyan-300">{memoryToDelete.key}</strong>? Your assistant will no longer remember this preference.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMemoryToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white border-rose-500/40"
              >
                {isDeleting ? 'Deleting...' : 'Delete Memory'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryVaultPage
