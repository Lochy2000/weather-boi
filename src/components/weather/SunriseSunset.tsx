import React, { useMemo, useState } from 'react';
import { Card } from '../ui/card';
import { DailyForecast } from '../../types';
import { Sunrise, Sunset, Sun } from 'lucide-react';

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

  // Calculate sun position on the arc
  const arcPathRadius = 80;
  const arcStartX = 20;
  const arcEndX = 180;
  const arcY = 100;

  // Create SVG arc path
  const arcPath = `M ${arcStartX} ${arcY} Q 100 20 ${arcEndX} ${arcY}`;

  // Calculate sun position along the arc
  const sunX = arcStartX + (arcEndX - arcStartX) * sunData.sunProgress;
  const sunY = arcY - Math.sin(sunData.sunProgress * Math.PI) * (arcY - 20);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 hover:border-neutral-600 transition-all"
      >
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-orange-500" />
          <span className="text-base sm:text-lg font-semibold text-neutral-0">Sun & Daylight</span>
          <span className="text-xs text-neutral-400">
            {sunData.sunriseTime} - {sunData.sunsetTime}
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-neutral-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border-orange-200/50 dark:border-orange-800/50">
      <div className="space-y-6">

        {/* Sun Arc Visualization */}
        <div className="relative h-32">
          <svg
            viewBox="0 0 200 120"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Background arc */}
            <path
              d={arcPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300 dark:text-gray-600"
              strokeLinecap="round"
            />

            {/* Progress arc (daylight passed) */}
            {sunData.isDaytime && (
              <path
                d={arcPath}
                fill="none"
                stroke="url(#sunGradient)"
                strokeWidth="3"
                className="transition-all duration-1000"
                strokeDasharray={`${sunData.sunProgress * 200} 200`}
                strokeLinecap="round"
              />
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Sunrise marker */}
            <g transform={`translate(${arcStartX}, ${arcY})`}>
              <circle
                r="4"
                fill="currentColor"
                className="text-orange-400 dark:text-orange-500"
              />
            </g>

            {/* Sunset marker */}
            <g transform={`translate(${arcEndX}, ${arcY})`}>
              <circle
                r="4"
                fill="currentColor"
                className="text-orange-600 dark:text-orange-700"
              />
            </g>

            {/* Current sun position (only show during daytime) */}
            {sunData.isDaytime && !sunData.hasPassedSunset && (
              <g transform={`translate(${sunX}, ${sunY})`}>
                <circle
                  r="8"
                  fill="#fbbf24"
                  className="animate-pulse"
                />
                <circle
                  r="6"
                  fill="#fcd34d"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Times Display */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sunrise */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Sunrise className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Sunrise</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {sunData.sunriseTime}
              </p>
            </div>
          </div>

          {/* Sunset */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-200 dark:bg-orange-800/30">
              <Sunset className="w-5 h-5 text-orange-700 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Sunset</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {sunData.sunsetTime}
              </p>
            </div>
          </div>
        </div>

        {/* Daylight Remaining (only show during daytime) */}
        {sunData.isDaytime && !sunData.hasPassedSunset && sunData.remainingHours >= 0 && (
          <div className="pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Daylight remaining
              </span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {sunData.remainingHours > 0 && `${sunData.remainingHours}h `}
                {sunData.remainingMinutes}m
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 rounded-full"
                style={{ width: `${sunData.sunProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* After sunset message */}
        {sunData.hasPassedSunset && (
          <div className="pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Sun has set. Next sunrise at {sunData.sunriseTime}
            </p>
          </div>
        )}

        {/* Before sunrise message */}
        {!sunData.isDaytime && !sunData.hasPassedSunset && (
          <div className="pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Sun rises at {sunData.sunriseTime}
            </p>
          </div>
        )}
      </div>
    </Card>
      )}
    </div>
  );
}
