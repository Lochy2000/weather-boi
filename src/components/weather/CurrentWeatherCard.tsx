import React from 'react';
import { format, parseISO } from 'date-fns';
import { WeatherIcon } from './weather-icon';
import { CurrentWeather, DailyForecast, Location } from '../../types';
import { getWeatherCondition } from '../../lib/utils/weather';
import { cn } from '../../lib/utils/cn';

interface CurrentWeatherCardProps {
  currentWeather?: CurrentWeather;
  dailyForecast?: DailyForecast;
  selectedDay: number;
  location: Location;
  className?: string;
  isLoading?: boolean;
}

export function CurrentWeatherCard({
  currentWeather,
  dailyForecast,
  selectedDay,
  location,
  className,
  isLoading = false
}: CurrentWeatherCardProps) {
  // Use daily forecast data if a day other than today is selected
  const isToday = selectedDay === 0;

  let temperature: number;
  let weatherCode: number;
  let displayDate: Date;

  if (isToday && currentWeather) {
    temperature = Math.round(currentWeather.temperature_2m);
    weatherCode = currentWeather.weather_code;
    displayDate = new Date(currentWeather.time);
  } else if (dailyForecast) {
    // For selected day, show the max temperature
    temperature = Math.round(dailyForecast.temperature_2m_max[selectedDay]);
    weatherCode = dailyForecast.weather_code[selectedDay];
    displayDate = parseISO(dailyForecast.time[selectedDay]);
  } else {
    return null;
  }

  const weatherCondition = getWeatherCondition(weatherCode);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 sm:p-8 text-neutral-0',
        'bg-cover bg-center bg-no-repeat',
        className
      )}
      style={{
        backgroundImage: `url('/assets/images/bg-today-small.svg')`,
      }}
    >
      {/* Desktop background for larger screens */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat rounded-2xl"
        style={{
          backgroundImage: `url('/assets/images/bg-today-large.svg')`,
        }}
      />

      <div className="relative h-full flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1">{location.name}, {location.country}</h2>
          <p className="text-neutral-0/70 text-base">
            {format(displayDate, 'EEEE, MMM d, yyyy')}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center gap-4 sm:gap-8 animate-pulse">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-neutral-0/20 rounded-full" />
              <div className="h-16 sm:h-24 w-32 sm:w-48 bg-neutral-0/20 rounded-lg" />
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-8">
              <WeatherIcon
                icon={weatherCondition.icon}
                size="xl"
                className="drop-shadow-lg w-20 h-20 sm:w-28 sm:h-28"
              />
              <div className="text-6xl sm:text-8xl font-bold font-bricolage tracking-tighter">
                {temperature}°
              </div>
            </div>
          )}
        </div>

        {/* Show min/max temp for selected day if not today */}
        {!isToday && dailyForecast && (
          <div className="mt-4 text-center text-neutral-0/70">
            <span className="text-sm">
              L: {Math.round(dailyForecast.temperature_2m_min[selectedDay])}°
              {' '}H: {Math.round(dailyForecast.temperature_2m_max[selectedDay])}°
            </span>
          </div>
        )}
      </div>
    </div>
  );
}