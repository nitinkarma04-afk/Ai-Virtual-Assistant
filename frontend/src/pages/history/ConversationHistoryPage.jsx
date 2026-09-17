import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  History,
  Search,
  Trash2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { chatService, getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { HistorySkeleton } from '../../components/history/HistorySkeleton'
import { HistoryEmptyState } from '../../components/history/HistoryEmptyState'
import { HistoryDeleteDialog } from '../../components/history/HistoryDeleteDialog'
import { ConversationHistoryList } from '../../components/history/ConversationHistoryList'
import { ConversationDetailModal } from '../../components/history/ConversationDetailModal'

export const ConversationHistoryPage = () => {
  const { assistant } = useAuth()
  const assistantName = assistant?.name || assistant?.assistantName || 'Your Assistant'

  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // State for inspecting a single conversation modal
  const [selectedConversation, setSelectedConversation] = useState(null)

  // State for clear history confirmation dialog
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch past conversation history from backend
  const fetchHistory = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const data = await chatService.getHistory()
      const rawList =
        data?.conversations ||
        data?.history ||
        data?.messages ||
        (Array.isArray(data) ? data : [])

      if (Array.isArray(rawList)) {
        setConversations(rawList)
      } else {
        setConversations([])
      }
    } catch (err) {
      console.error('Failed to load conversation history:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    chatService
      .getHistory()
      .then((data) => {
        if (!isMounted) return
        const rawList =
          data?.conversations ||
          data?.history ||
          data?.messages ||
          (Array.isArray(data) ? data : [])
        setConversations(Array.isArray(rawList) ? rawList : [])
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

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return conversations

    return conversations.filter((item) => {
      const msg = (item.message || '').toLowerCase()
      const resp = (item.response || '').toLowerCase()
      return msg.includes(query) || resp.includes(query)
    })
  }, [conversations, searchQuery])

  // Handle clearing full conversation history
  const handleConfirmClear = async () => {
    setIsDeleting(true)
    try {
      await chatService.clearHistory()
      setConversations([])
      setIsDeleteModalOpen(false)
    } catch (err) {
      console.error('Failed to clear history:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 relative overflow-x-hidden transition-colors duration-200">
      {/* Background Ambient Lights */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header / Navigation Bar */}
      <header className="w-full px-4 sm:px-6 py-4 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="Return to Assistant"
              >
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  Conversation History
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchHistory(true)}
              disabled={isLoading}
              title="Refresh"
              className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300"
            />

            {conversations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 text-xs px-3"
              >
                <span className="hidden md:inline">Clear History</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
        {/* Page Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" dot className="text-[10px] py-0.5">
                Conversation Log
              </Badge>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">• {assistantName}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Your Past Conversations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Browse and search through all your previous conversations with your AI assistant.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard">
              <Button variant="glow" size="sm" icon={MessageSquare}>
                New Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Notification State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-rose-700 dark:text-rose-200">Failed to load history</strong>
              <span>{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => fetchHistory(true)} className="text-rose-500 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white">
              Retry
            </Button>
          </div>
        )}

        {/* Search & Filter Bar */}
        {(conversations.length > 0 || searchQuery) && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-400/30 dark:focus:ring-cyan-500/30 transition-all shadow-sm dark:shadow-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Content Render Switch */}
        {isLoading ? (
          <HistorySkeleton />
        ) : conversations.length === 0 ? (
          <HistoryEmptyState />
        ) : filteredConversations.length === 0 ? (
          <HistoryEmptyState isSearch onResetSearch={() => setSearchQuery('')} />
        ) : (
          <ConversationHistoryList
            conversations={filteredConversations}
            onItemClick={(item) => setSelectedConversation(item)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-600 font-mono border-t border-slate-200 dark:border-slate-900 mt-12 relative z-10">
        Conversation History • {assistantName}
      </footer>

      {/* Inspect Single Conversation Modal */}
      <ConversationDetailModal
        conversation={selectedConversation}
        onClose={() => setSelectedConversation(null)}
      />

      {/* Delete Confirmation Modal */}
      <HistoryDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmClear}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default ConversationHistoryPage
