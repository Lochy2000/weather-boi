import React from 'react';
import { useAppStore } from '../../stores/app.store';
import { Units } from '../../types';
import { cn } from '../../lib/utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { units, setUnits } = useAppStore();

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    const newUnits: Units = {
      temperature: newUnit === 'metric' ? 'celsius' : 'fahrenheit',
      windSpeed: newUnit === 'metric' ? 'kmh' : 'mph',
      precipitation: newUnit === 'metric' ? 'mm' : 'inch',
    };
    setUnits(newUnits);
  };

  const currentUnit = units.temperature === 'celsius' ? 'metric' : 'imperial';

  return (
    <header className={cn('w-full', className)}>
      <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-2">
          <img 
            src="/assets/images/logo.svg" 
            alt="Weather Now" 
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-neutral-0">Weather Now</span>
        </div>
        
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-0 transition-colors hover:bg-neutral-700"
            onClick={() => handleUnitChange(currentUnit === 'metric' ? 'imperial' : 'metric')}
          >
            <img 
              src="/assets/images/icon-units.svg" 
              alt="Units" 
              className="h-4 w-4"
            />
            <span>Units</span>
            <img 
              src="/assets/images/icon-dropdown.svg" 
              alt="Toggle" 
              className="h-3 w-3"
            />
          </button>
        </div>
      </div>
    </header>
  );
}