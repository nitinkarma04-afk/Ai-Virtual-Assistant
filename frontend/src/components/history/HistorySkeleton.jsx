import React from 'react'

export const HistorySkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="h-12 w-full bg-slate-900/60 rounded-2xl border border-slate-800/80" />

      {/* Date Group Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 bg-slate-800/80 rounded-md" />
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-800 rounded" />
                <div className="h-3 w-16 bg-slate-800 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistorySkeleton

