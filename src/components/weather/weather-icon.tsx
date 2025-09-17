import React from 'react';
import { cn } from '../../lib/utils/cn';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function WeatherIcon({ icon, size = 'md', className }: WeatherIconProps) {
  const iconPath = `/assets/images/icon-${icon}.webp`;
  
  return (
    <img 
      src={iconPath}
      alt={`Weather icon: ${icon}`}
      className={cn(sizeMap[size], 'object-contain', className)}
      loading="lazy"
      onError={(e) => {
        // Fallback to sunny icon if image fails to load
        (e.target as HTMLImageElement).src = '/assets/images/icon-sunny.webp';
      }}
    />
  );
}