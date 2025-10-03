import React, { useState } from 'react';
import { Card } from '../ui/card';
import { CurrentWeather, DailyForecast, Units } from '../../types';

interface ExtendedMetricsProps {
  weather: CurrentWeather;
  dailyForecast?: DailyForecast;
  selectedDay?: number;
  units: Units;
}

function getUVLevel(uvIndex: number): { level: string; color: string; description: string } {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-400', description: 'Minimal sun protection required' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-400', description: 'Seek shade during midday' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-400', description: 'Protection essential' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-400', description: 'Extra protection required' };
  return { level: 'Extreme', color: 'text-purple-400', description: 'Take all precautions' };
}

function getVisibilityDescription(visibilityMeters: number): string {
  const km = visibilityMeters / 1000;
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
}

export function ExtendedMetrics({ weather, dailyForecast, selectedDay = 0, units }: ExtendedMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const useCurrentWeather = selectedDay === 0 || !dailyForecast;

  // Get UV Index (use max for daily forecast)
  const uvIndex = useCurrentWeather
    ? weather.uv_index
    : dailyForecast?.uv_index_max?.[selectedDay] ?? weather.uv_index;

  // Get Pressure (use mean for daily forecast)
  const pressure = useCurrentWeather
    ? weather.pressure_msl
    : dailyForecast?.pressure_msl_mean?.[selectedDay] ?? weather.pressure_msl;

  // Get Cloud Cover (use mean for daily forecast)
  const cloudCover = useCurrentWeather
    ? weather.cloud_cover
    : dailyForecast?.cloud_cover_mean?.[selectedDay] ?? weather.cloud_cover;

  // Wind gusts (use max for daily forecast)
  const windGusts = useCurrentWeather
    ? weather.wind_gusts_10m
    : dailyForecast?.wind_gusts_10m_max?.[selectedDay] ?? weather.wind_gusts_10m;

  // Visibility is only available in current weather, not daily forecast
  const visibility = weather.visibility;

  const hasExtendedData = uvIndex !== undefined || visibility !== undefined || pressure !== undefined;

  if (!hasExtendedData) {
    return null;
  }

  // Count available metrics
  const availableMetrics = [
    uvIndex !== undefined,
    visibility !== undefined,
    pressure !== undefined,
    windGusts !== undefined,
    cloudCover !== undefined
  ].filter(Boolean).length;

  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : null;
  const visibilityMiles = visibility ? (visibility / 1609.34).toFixed(1) : null;
  const pressureHpa = pressure?.toFixed(0);
  const pressureInHg = pressure ? (pressure * 0.02953).toFixed(2) : null;
  const uvData = uvIndex !== undefined ? getUVLevel(uvIndex) : null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 hover:border-neutral-600 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-semibold text-neutral-0">Extended Metrics</span>
          <span className="text-xs text-neutral-400 bg-neutral-700 px-2 py-0.5 rounded-full">
            {availableMetrics}
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {/* UV Index */}
        {uvIndex !== undefined && uvData && (
          <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-xs sm:text-sm text-neutral-300">
                  {useCurrentWeather ? "UV Index" : "Max UV Index"}
                </p>
                <p className="mb-2 text-2xl sm:text-3xl font-bold text-neutral-0">
                  {Math.round(uvIndex)}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${uvData.color}`}>
                  {uvData.level}
                </p>
                <p className="mt-1 text-xs text-neutral-400 hidden sm:block">
                  {uvData.description}
                </p>
              </div>
              <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </Card>
        )}

        {/* Visibility */}
        {visibility !== undefined && (
          <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-xs sm:text-sm text-neutral-300">Visibility</p>
                <p className="mb-2 text-2xl sm:text-3xl font-bold text-neutral-0">
                  {units.precipitation === 'mm' ? visibilityKm : visibilityMiles}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {units.precipitation === 'mm' ? 'km' : 'mi'}
                </p>
                <p className="mt-1 text-xs text-neutral-400 hidden sm:block">
                  {getVisibilityDescription(visibility)}
                </p>
              </div>
              <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </Card>
        )}

        {/* Air Pressure */}
        {pressure !== undefined && (
          <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-xs sm:text-sm text-neutral-300">
                  {useCurrentWeather ? "Pressure" : "Avg Pressure"}
                </p>
                <p className="mb-2 text-2xl sm:text-3xl font-bold text-neutral-0">
                  {units.precipitation === 'mm' ? pressureHpa : pressureInHg}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {units.precipitation === 'mm' ? 'hPa' : 'inHg'}
                </p>
                <p className="mt-1 text-xs text-neutral-400 hidden sm:block">
                  Sea level
                </p>
              </div>
              <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </Card>
        )}

        {/* Wind Gusts */}
        {windGusts !== undefined && (
          <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-xs sm:text-sm text-neutral-300">
                  {useCurrentWeather ? "Wind Gusts" : "Max Wind Gusts"}
                </p>
                <p className="mb-2 text-2xl sm:text-3xl font-bold text-neutral-0">
                  {Math.round(windGusts)}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {units.windSpeed === 'kmh' ? 'km/h' : units.windSpeed}
                </p>
                <p className="mt-1 text-xs text-neutral-400 hidden sm:block">
                  Maximum gusts
                </p>
              </div>
              <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Card>
        )}

        {/* Cloud Cover */}
        {cloudCover !== undefined && (
          <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-xs sm:text-sm text-neutral-300">
                  {useCurrentWeather ? "Cloud Cover" : "Avg Cloud Cover"}
                </p>
                <p className="mb-2 text-2xl sm:text-3xl font-bold text-neutral-0">
                  {Math.round(cloudCover)}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">%</p>
                <p className="mt-1 text-xs text-neutral-400 hidden sm:block">
                  {cloudCover <= 25 ? 'Clear' : cloudCover <= 50 ? 'Partly cloudy' : cloudCover <= 75 ? 'Mostly cloudy' : 'Overcast'}
                </p>
              </div>
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </Card>
        )}
        </div>
      )}
    </div>
  );
}
