import React from 'react';
import { cn } from '../../lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-neutral-200', className)}
      {...props}
    />
  );
}

export { Skeleton };