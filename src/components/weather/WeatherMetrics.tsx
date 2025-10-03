import React from 'react';
import { Card } from '../ui/card';
import { CurrentWeather, DailyForecast, Units } from '../../types';
import { formatWindSpeed, formatPrecipitation, getWindDirection } from '../../lib/utils/weather';

interface WeatherMetricsProps {
  weather: CurrentWeather;
  dailyForecast?: DailyForecast;
  selectedDay?: number;
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

export function WeatherMetrics({ weather, dailyForecast, selectedDay = 0, units }: WeatherMetricsProps) {
  // If selectedDay is 0 (today) or no daily forecast, use current weather
  // Otherwise, use daily forecast data for the selected day
  const useCurrentWeather = selectedDay === 0 || !dailyForecast;

  const feelsLike = useCurrentWeather
    ? Math.round(weather.apparent_temperature)
    : dailyForecast?.apparent_temperature_max?.[selectedDay]
      ? Math.round(dailyForecast.apparent_temperature_max[selectedDay])
      : Math.round(weather.apparent_temperature);

  const humidity = useCurrentWeather
    ? weather.relative_humidity_2m
    : dailyForecast?.relative_humidity_2m_mean?.[selectedDay] ?? weather.relative_humidity_2m;

  const windSpeedValue = useCurrentWeather
    ? weather.wind_speed_10m
    : dailyForecast?.wind_speed_10m_max?.[selectedDay] ?? weather.wind_speed_10m;

  const windDirectionValue = useCurrentWeather
    ? weather.wind_direction_10m
    : dailyForecast?.wind_direction_10m_dominant?.[selectedDay] ?? weather.wind_direction_10m;

  const precipitationValue = useCurrentWeather
    ? weather.precipitation
    : dailyForecast?.precipitation_sum?.[selectedDay] ?? weather.precipitation;

  const windSpeed = formatWindSpeed(windSpeedValue, units.windSpeed);
  const windDirection = getWindDirection(windDirectionValue);
  const precipitation = formatPrecipitation(precipitationValue, units.precipitation);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <MetricCard
        label={useCurrentWeather ? "Feels Like" : "Max Feels Like"}
        value={`${feelsLike}°`}
      />
      <MetricCard
        label={useCurrentWeather ? "Humidity" : "Avg Humidity"}
        value={`${Math.round(humidity)}%`}
      />
      <MetricCard
        label={useCurrentWeather ? "Wind" : "Max Wind"}
        value={`${windSpeed} ${windDirection}`}
      />
      <MetricCard
        label={useCurrentWeather ? "Precipitation" : "Total Precip."}
        value={precipitation}
      />
    </div>
  );
}
