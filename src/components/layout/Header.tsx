import React from 'react';
import { cn } from '../../lib/utils/cn';
import { UnitDropdown } from './UnitDropdown';
import { FavoritesDropdown } from '../favorites/FavoritesDropdown';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Logo } from './Logo';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('w-full', className)}>
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-6">
        <Logo className="h-10 w-auto md:h-12" />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <FavoritesDropdown />
          <UnitDropdown />
        </div>
      </div>
    </header>
  );
}