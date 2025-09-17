import React from 'react';
import { format } from 'date-fns';
import { WeatherIcon } from './weather-icon';
import { CurrentWeather, Location } from '../../types';
import { formatTemperature, getWeatherCondition } from '../../lib/utils/weather';
import { cn } from '../../lib/utils/cn';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  location: Location;
  unit: 'celsius' | 'fahrenheit';
  className?: string;
}

export function CurrentWeatherCard({ 
  weather, 
  location, 
  unit, 
  className 
}: CurrentWeatherCardProps) {
  const weatherCondition = getWeatherCondition(weather.weather_code);
  const temperature = Math.round(weather.temperature_2m);

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-neutral-0',
      className
    )}>
      {/* Decorative stars */}
      <div className="absolute left-8 top-8 h-2 w-2 rotate-45 bg-neutral-0 opacity-40" />
      <div className="absolute right-12 top-12 h-1.5 w-1.5 rotate-45 bg-neutral-0 opacity-30" />
      <div className="absolute bottom-8 left-16 h-1 w-1 rotate-45 bg-neutral-0 opacity-20" />
      <div className="absolute bottom-16 right-8 h-2.5 w-2.5 rotate-45 bg-orange-500" />
      
      <div className="relative">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">{location.name}, {location.country}</h2>
          <p className="text-neutral-0/80">
            {format(new Date(weather.time), 'EEEE, MMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <WeatherIcon 
              icon={weatherCondition.icon} 
              size="xl"
              className="drop-shadow-lg"
            />
            <div className="text-7xl font-bold font-bricolage">
              {temperature}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}