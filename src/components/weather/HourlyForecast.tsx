import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '../ui/card';
import { WeatherIcon } from './weather-icon';
import { HourlyForecast as HourlyForecastType, DailyForecast, Units } from '../../types';
import { getWeatherCondition, isNightTime } from '../../lib/utils/weather';
import { cn } from '../../lib/utils/cn';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType;
  dailyData: DailyForecast;
  selectedDay: number;
  units: Units;
}

export function HourlyForecast({ hourlyData, dailyData, selectedDay, units }: HourlyForecastProps) {
  // Get the selected day's date
  const selectedDate = parseISO(dailyData.time[selectedDay]);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  
  // Filter hourly data for the selected day
  const dayHours = hourlyData.time
    .map((time, index) => ({
      time,
      temperature: hourlyData.temperature_2m[index],
      weatherCode: hourlyData.weather_code[index],
      isDay: hourlyData.is_day[index],
    }))
    .filter(hour => hour.time.startsWith(selectedDateStr));

  return (
    <Card className="border-neutral-700 bg-neutral-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-0">Hourly forecast</h3>
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <span>{format(selectedDate, 'EEEE')}</span>
          <img 
            src="/assets/images/icon-dropdown.svg" 
            alt="Select day" 
            className="h-3 w-3"
          />
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {dayHours.map((hour, index) => {
          const time = format(parseISO(hour.time), 'h a');
          const weatherCondition = getWeatherCondition(hour.weatherCode);
          const temperature = Math.round(hour.temperature);
          const isNight = isNightTime(hour.isDay);
          
          return (
            <div 
              key={hour.time}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className={cn(
                  "w-16 text-sm",
                  isNight ? "text-neutral-300" : "text-neutral-0"
                )}>
                  {time}
                </span>
                <WeatherIcon 
                  icon={isNight && weatherCondition.icon === 'sunny' ? 'partly-cloudy' : weatherCondition.icon} 
                  size="sm" 
                />
              </div>
              <span className="text-lg font-medium text-neutral-0">
                {temperature}°
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}