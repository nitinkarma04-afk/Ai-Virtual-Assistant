import React from 'react'

export const MemorySkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="h-12 w-full bg-slate-900/60 rounded-2xl border border-slate-800/80" />

      {/* Memory Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 space-y-4 flex flex-col justify-between h-44"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-800 rounded-md" />
              <div className="h-6 w-6 bg-slate-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-800/70 rounded" />
            </div>
            <div className="h-3 w-20 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemorySkeleton

