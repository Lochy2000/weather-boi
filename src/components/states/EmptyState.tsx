import React from 'react';

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-neutral-300">
          Search for a location to see the weather forecast
        </p>
      </div>
    </div>
  );
}