import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function LoadingState() {
  return (
    <div className="space-y-8">
      {/* Current weather skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-800 p-8">
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-300" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-300 animation-delay-200" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-300 animation-delay-400" />
            </div>
            <p className="text-neutral-300">Loading...</p>
          </div>
        </div>
      </div>

      {/* Weather metrics skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg bg-neutral-800 p-4">
            <Skeleton className="mb-2 h-4 w-20 bg-neutral-700" />
            <Skeleton className="h-8 w-16 bg-neutral-700" />
          </div>
        ))}
      </div>

      {/* Daily forecast skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-32 bg-neutral-700" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-7 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="rounded-lg bg-neutral-800 p-4">
              <Skeleton className="mb-3 h-4 w-12 mx-auto bg-neutral-700" />
              <Skeleton className="mb-3 h-12 w-12 mx-auto bg-neutral-700 rounded-full" />
              <div className="flex justify-center gap-2">
                <Skeleton className="h-4 w-8 bg-neutral-700" />
                <Skeleton className="h-4 w-8 bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div className="rounded-lg bg-neutral-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-neutral-700" />
          <Skeleton className="h-4 w-24 bg-neutral-700" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16 bg-neutral-700" />
                <Skeleton className="h-8 w-8 bg-neutral-700 rounded-full" />
              </div>
              <Skeleton className="h-6 w-12 bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}