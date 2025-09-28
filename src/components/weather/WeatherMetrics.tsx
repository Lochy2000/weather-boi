import React from 'react';
import { Card } from '../ui/card';
import { CurrentWeather, Units } from '../../types';
import { formatWindSpeed, formatPrecipitation, getWindDirection } from '../../lib/utils/weather';

interface WeatherMetricsProps {
  weather: CurrentWeather;
  units: Units;
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="border-neutral-700 bg-neutral-800 p-3 sm:p-4 text-center">
      <p className="mb-2 text-sm text-neutral-300">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold text-neutral-0">{value}</p>
    </Card>
  );
}

export function WeatherMetrics({ weather, units }: WeatherMetricsProps) {
  const feelsLike = Math.round(weather.apparent_temperature);
  const humidity = weather.relative_humidity_2m;
  const windSpeed = formatWindSpeed(weather.wind_speed_10m, units.windSpeed);
  const windDirection = getWindDirection(weather.wind_direction_10m);
  const precipitation = formatPrecipitation(weather.precipitation, units.precipitation);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <MetricCard 
        label="Feels Like" 
        value={`${feelsLike}°`}
      />
      <MetricCard 
        label="Humidity" 
        value={`${humidity}%`}
      />
      <MetricCard 
        label="Wind" 
        value={`${windSpeed} ${windDirection}`}
      />
      <MetricCard 
        label="Precipitation" 
        value={precipitation}
      />
    </div>
  );
}