import React from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { Card } from '../ui/card';
import { WeatherIcon } from './weather-icon';
import { DailyForecast as DailyForecastType, Units } from '../../types';
import { getWeatherCondition } from '../../lib/utils/weather';
import { cn } from '../../lib/utils/cn';

interface DailyForecastProps {
  forecast: DailyForecastType;
  units: Units;
  onDaySelect?: (index: number) => void;
  selectedDay?: number;
}

interface DayCardProps {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function DayCard({ date, weatherCode, tempMax, tempMin, isSelected, onClick }: DayCardProps) {
  const weatherCondition = getWeatherCondition(weatherCode);
  const parsedDate = parseISO(date);
  const dayName = isToday(parsedDate) ? 'Today' : format(parsedDate, 'EEE');

  return (
    <Card
      className={cn(
        'cursor-pointer border-neutral-700 bg-neutral-800 p-3 sm:p-4 text-center transition-all hover:border-neutral-600',
        isSelected && 'border-blue-500 bg-neutral-700'
      )}
      onClick={onClick}
    >
      <p className="mb-3 text-sm font-medium text-neutral-0">{dayName}</p>
      <WeatherIcon icon={weatherCondition.icon} size="md" className="mx-auto mb-3" />
      <div className="flex justify-center gap-2 text-sm">
        <span className="font-semibold text-neutral-0">{Math.round(tempMax)}°</span>
        <span className="text-neutral-300">{Math.round(tempMin)}°</span>
      </div>
    </Card>
  );
}

export function DailyForecast({ forecast, units, onDaySelect, selectedDay = 0 }: DailyForecastProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-base sm:text-lg font-semibold text-neutral-0">Daily forecast</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-7 md:gap-4">
        {forecast.time.slice(0, 7).map((date, index) => (
          <DayCard
            key={date}
            date={date}
            weatherCode={forecast.weather_code[index]}
            tempMax={forecast.temperature_2m_max[index]}
            tempMin={forecast.temperature_2m_min[index]}
            isSelected={selectedDay === index}
            onClick={() => onDaySelect?.(index)}
          />
        ))}
      </div>
    </div>
  );
}