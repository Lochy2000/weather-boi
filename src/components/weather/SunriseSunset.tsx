import React, { useMemo, useState } from 'react';
import { DailyForecast } from '../../types';
import { Sunrise, Sunset, Sun, Moon } from 'lucide-react';

interface SunriseSunsetProps {
  dailyForecast: DailyForecast;
  selectedDay: number;
}

export function SunriseSunset({ dailyForecast, selectedDay }: SunriseSunsetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sunData = useMemo(() => {
    if (!dailyForecast.sunrise || !dailyForecast.sunset) {
      return null;
    }

    const sunrise = dailyForecast.sunrise[selectedDay];
    const sunset = dailyForecast.sunset[selectedDay];
    const daylightDuration = dailyForecast.daylight_duration?.[selectedDay];

    if (!sunrise || !sunset) return null;

    // Parse times
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    const now = new Date();

    // Format times for display
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    // Calculate sun position (0 to 1, where 0.5 is noon/zenith)
    const totalDayMinutes = (sunsetTime.getTime() - sunriseTime.getTime()) / 1000 / 60;
    const minutesSinceSunrise = (now.getTime() - sunriseTime.getTime()) / 1000 / 60;
    const sunProgress = Math.max(0, Math.min(1, minutesSinceSunrise / totalDayMinutes));

    // Calculate remaining daylight
    const remainingMinutes = Math.max(0, (sunsetTime.getTime() - now.getTime()) / 1000 / 60);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.floor(remainingMinutes % 60);

    // Format daylight duration
    const daylightHours = daylightDuration ? Math.floor(daylightDuration / 3600) : 0;
    const daylightMinutes = daylightDuration ? Math.floor((daylightDuration % 3600) / 60) : 0;

    const isDaytime = now >= sunriseTime && now <= sunsetTime;
    const hasPassedSunset = now > sunsetTime;

    return {
      sunriseTime: formatTime(sunriseTime),
      sunsetTime: formatTime(sunsetTime),
      sunProgress,
      remainingHours: hours,
      remainingMinutes: minutes,
      daylightHours,
      daylightMinutes,
      isDaytime,
      hasPassedSunset
    };
  }, [dailyForecast, selectedDay]);

  if (!sunData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all group"
      >
        <div className="flex items-center gap-2">
          {sunData.isDaytime && !sunData.hasPassedSunset ? (
            <Sun className="w-4 h-4 text-orange-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <Sunrise className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
            {sunData.sunriseTime}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <Sunset className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
            {sunData.sunsetTime}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {sunData.daylightHours}h {sunData.daylightMinutes}m daylight
          </span>
        </div>
        <svg
          className={`h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
    <div className="mt-3 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border border-orange-200/50 dark:border-orange-900/30 shadow-sm">
      <div className="space-y-6">

        {/* Horizontal Day/Night Timeline */}
        <div className="relative py-8">
          {/* Timeline gradient bar */}
          <div className="relative h-3 rounded-full overflow-hidden">
            {/* Day gradient (sunrise to sunset) */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-amber-400 to-indigo-900"></div>
          </div>

          {/* Timeline markers container */}
          <div className="absolute inset-0 flex items-center">
            {/* Sunrise marker */}
            <div className="absolute flex flex-col items-center" style={{ left: '0%' }}>
              <div className="flex flex-col items-center -translate-y-2">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50 border-2 border-orange-400">
                  <Sunrise className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="mt-6 text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {sunData.sunriseTime}
                </div>
              </div>
            </div>

            {/* Sunset marker */}
            <div className="absolute flex flex-col items-center" style={{ left: '100%' }}>
              <div className="flex flex-col items-center -translate-x-full -translate-y-2">
                <div className="p-2 rounded-full bg-orange-200 dark:bg-orange-800/50 border-2 border-orange-600">
                  <Sunset className="w-4 h-4 text-orange-700 dark:text-orange-500" />
                </div>
                <div className="mt-6 text-xs font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {sunData.sunsetTime}
                </div>
              </div>
            </div>

            {/* Current position indicator - Sun or Moon */}
            {sunData.isDaytime && !sunData.hasPassedSunset && (
              <div
                className="absolute flex flex-col items-center transition-all duration-1000"
                style={{ left: `${sunData.sunProgress * 100}%` }}
              >
                <div className="flex flex-col items-center -translate-x-1/2 -translate-y-2">
                  <div className="p-2.5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-400 shadow-lg animate-pulse">
                    <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="mt-6 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                    Now
                  </div>
                </div>
              </div>
            )}

            {/* Moon indicator (nighttime) */}
            {!sunData.isDaytime && (
              <div className="absolute left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-2">
                <div className="p-2.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-400 shadow-lg">
                  <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="mt-6 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  {sunData.hasPassedSunset ? 'Night' : 'Night'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daylight info */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {sunData.daylightHours}h {sunData.daylightMinutes}m
            </span>
            {' '}of daylight
          </p>
        </div>

        {/* Daylight Remaining (only show during daytime) */}
        {sunData.isDaytime && !sunData.hasPassedSunset && sunData.remainingHours >= 0 && (
          <div className="pt-4 border-t border-neutral-300/50 dark:border-neutral-600/50">
            <div className="flex items-center justify-between text-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Daylight remaining
              </span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {sunData.remainingHours > 0 && `${sunData.remainingHours}h `}
                {sunData.remainingMinutes}m
              </span>
            </div>
          </div>
        )}

        {/* After sunset message */}
        {sunData.hasPassedSunset && (
          <div className="pt-4 border-t border-neutral-300/50 dark:border-neutral-600/50">
            <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
              Sun has set • Next sunrise at {sunData.sunriseTime}
            </p>
          </div>
        )}

        {/* Before sunrise message */}
        {!sunData.isDaytime && !sunData.hasPassedSunset && (
          <div className="pt-4 border-t border-neutral-300/50 dark:border-neutral-600/50">
            <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
              Sun rises at {sunData.sunriseTime}
            </p>
          </div>
        )}
      </div>
    </div>
      )}
    </div>
  );
}
