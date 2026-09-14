import React from 'react'
import { Trash2, Key, Clock } from 'lucide-react'
import { Badge } from '../common/Badge'

export const MemoryCard = ({ memory, onDelete }) => {
  const formattedKey = memory.key ? memory.key.replace(/_/g, ' ').toUpperCase() : 'GENERAL'
  const rawTimestamp = memory.updatedAt || memory.createdAt
  const formattedDate = rawTimestamp
    ? new Date(rawTimestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between gap-4 relative overflow-hidden">
      {/* Header Row: Key Badge & Delete Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <Badge variant="cyan" className="text-[10px] py-0.5 px-2 font-mono truncate">
            {formattedKey}
          </Badge>
        </div>

        <button
          onClick={() => onDelete(memory)}
          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors focus:outline-none shrink-0"
          title="Delete memory entry"
          aria-label={`Delete memory ${memory.key}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Memory Value */}
      <p className="text-sm font-medium text-slate-200 leading-relaxed break-words">
        {memory.value}
      </p>

      {/* Footer Timestamp */}
      {formattedDate && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/40">
          <Clock className="w-3 h-3" />
          <span>Updated {formattedDate}</span>
        </div>
      )}
    </div>
  )
}

export default MemoryCard

