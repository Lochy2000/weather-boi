import React from 'react';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { WeatherMetrics } from './WeatherMetrics';
import { DailyForecast } from './DailyForecast';
import { HourlyForecast } from './HourlyForecast';
import { WeatherData, Location } from '../../types';
import { useAppStore } from '../../stores/app.store';

interface WeatherDashboardProps {
  weather: WeatherData;
  location: Location;
}

export function WeatherDashboard({ weather, location }: WeatherDashboardProps) {
  const { units, selectedDay, setSelectedDay } = useAppStore();

  if (!weather.current || !weather.daily || !weather.hourly) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <CurrentWeatherCard
          weather={weather.current}
          location={location}
          unit={units.temperature}
        />
        <WeatherMetrics weather={weather.current} units={units} />
        <DailyForecast 
          forecast={weather.daily} 
          units={units}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
      </div>
      
      <div className="lg:col-span-1">
        <HourlyForecast
          hourlyData={weather.hourly}
          dailyData={weather.daily}
          selectedDay={selectedDay}
          units={units}
        />
      </div>
    </div>
  );
}