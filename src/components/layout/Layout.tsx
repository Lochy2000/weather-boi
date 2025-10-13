import React from 'react';
import { Header } from './Header';
import { InstallBanner } from './InstallBanner';
import { cn } from '../../lib/utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex flex-col">
      <Header />
      <main className={cn(
        'mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 md:px-8 md:pb-12 md:pt-8 flex-1',
        className
      )}>
        {children}
      </main>
      <InstallBanner />
    </div>
  );
}