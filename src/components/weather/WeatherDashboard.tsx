import React from 'react';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { WeatherMetrics } from './WeatherMetrics';
import { ExtendedMetrics } from './ExtendedMetrics';
import { SunriseSunset } from './SunriseSunset';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import { WeatherData, Location } from '../../types';
import { useAppStore } from '../../stores/app.store';

interface WeatherDashboardProps {
  weather: WeatherData;
  location: Location;
}

export function WeatherDashboard({ weather, location }: WeatherDashboardProps) {
  const { units, selectedDay, setSelectedDay, isDayTransitioning, setDayTransitioning } = useAppStore();

  const handleDaySelect = (day: number) => {
    if (day === selectedDay) return; // Don't transition if same day clicked

    // Start loading animation
    setDayTransitioning(true);
    setSelectedDay(day);

    // End loading animation after 400ms
    setTimeout(() => {
      setDayTransitioning(false);
    }, 400);
  };

  if (!weather.current || !weather.daily || !weather.hourly) {
    return null;
  }

  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        <CurrentWeatherCard
          currentWeather={weather.current}
          dailyForecast={weather.daily}
          selectedDay={selectedDay}
          location={location}
          isLoading={isDayTransitioning}
        />
        <WeatherMetrics
          weather={weather.current}
          dailyForecast={weather.daily}
          selectedDay={selectedDay}
          units={units}
        />
        <ExtendedMetrics
          weather={weather.current}
          dailyForecast={weather.daily}
          selectedDay={selectedDay}
          units={units}
        />
        <SunriseSunset
          dailyForecast={weather.daily}
          selectedDay={selectedDay}
        />
        <DailyForecast
          forecast={weather.daily}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
        />
      </div>

      <div className="lg:col-span-1">
        <HourlyForecast
          hourlyData={weather.hourly}
          dailyData={weather.daily}
          selectedDay={selectedDay}
          isLoading={isDayTransitioning}
        />
      </div>
    </div>
  );
}