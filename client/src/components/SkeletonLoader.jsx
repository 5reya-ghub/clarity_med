import React from 'react'

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Summary card skeleton */}
      <div className="card p-6">
        <div className="skeleton h-4 w-32 mb-4 rounded" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="skeleton h-3 w-4/6 rounded" />
        </div>
      </div>

      {/* Finding card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton h-3 w-56 mb-3 rounded" />
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
