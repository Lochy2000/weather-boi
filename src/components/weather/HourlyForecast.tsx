import React, { useRef, useEffect, useState } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Card } from '../ui/card';
import { WeatherIcon } from './weather-icon';
import { HourlyForecast as HourlyForecastType, DailyForecast } from '../../types';
import { getWeatherCondition, isNightTime } from '../../lib/utils/weather';
import { cn } from '../../lib/utils/cn';
import { useAppStore } from '../../stores/app.store';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType;
  dailyData: DailyForecast;
  selectedDay: number;
  isLoading?: boolean;
}

export function HourlyForecast({ hourlyData, dailyData, selectedDay, isLoading = false }: HourlyForecastProps) {
  const { setSelectedDay } = useAppStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollIndicator, setScrollIndicator] = useState({ height: 0, top: 0, visible: false });

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

  // Update scroll indicator
  useEffect(() => {
    const updateScrollIndicator = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable) {
        setScrollIndicator(prev => ({ ...prev, visible: false }));
        return;
      }

      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      const indicatorMaxHeight = clientHeight * 0.8; // 80% of container height
      const indicatorHeight = Math.max(20, (clientHeight / scrollHeight) * indicatorMaxHeight);
      const indicatorTop = scrollPercentage * (indicatorMaxHeight - indicatorHeight);

      setScrollIndicator({
        height: indicatorHeight,
        top: indicatorTop,
        visible: true
      });
    };

    const container = scrollContainerRef.current;
    if (container) {
      updateScrollIndicator();
      container.addEventListener('scroll', updateScrollIndicator);

      return () => container.removeEventListener('scroll', updateScrollIndicator);
    }
  }, [dayHours]);

  return (
    <Card className="border-neutral-700 bg-neutral-800 p-4 sm:p-6 relative">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-0">Hourly forecast</h3>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-md px-3 py-1 text-sm text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-neutral-0">
              <span>{isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}</span>
              <img
                src="/assets/images/icon-dropdown.svg"
                alt="Select day"
                className="h-3 w-3"
              />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[140px] rounded-lg bg-neutral-700 p-2 shadow-lg"
              sideOffset={5}
              align="end"
            >
              {dailyData.time.slice(0, 7).map((date, index) => {
                const dayDate = parseISO(date);
                const dayName = isToday(dayDate) ? 'Today' : format(dayDate, 'EEEE');

                return (
                  <DropdownMenu.Item
                    key={date}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600 outline-none",
                      index === selectedDay && "bg-neutral-600"
                    )}
                    onSelect={() => setSelectedDay(index)}
                  >
                    <span>{dayName}</span>
                  </DropdownMenu.Item>
                );
              })}
              <DropdownMenu.Arrow className="fill-neutral-700" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="max-h-80 overflow-y-auto space-y-2 hide-scrollbar pr-2"
        >
        {isLoading ? (
          // Show loading skeleton
          <>
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-700 rounded-lg p-3 flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full" />
                  <div className="w-12 h-4 bg-neutral-600 rounded" />
                </div>
                <div className="w-8 h-5 bg-neutral-600 rounded" />
              </div>
            ))}
          </>
        ) : (
          // Show actual data
          dayHours.map((hour) => {
          const time = format(parseISO(hour.time), 'h a');
          const weatherCondition = getWeatherCondition(hour.weatherCode);
          const temperature = Math.round(hour.temperature);
          const isNight = isNightTime(hour.isDay);

          return (
            <div
              key={hour.time}
              className="bg-neutral-700 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <WeatherIcon
                  icon={isNight && weatherCondition.icon === 'sunny' ? 'partly-cloudy' : weatherCondition.icon}
                  size="sm"
                />
                <span className={cn(
                  "text-sm min-w-[3rem]",
                  isNight ? "text-neutral-300" : "text-neutral-0"
                )}>
                  {time}
                </span>
              </div>
              <span className="text-base font-medium text-neutral-0">
                {temperature}°
              </span>
            </div>
          );
        })
      )}
        </div>

        {/* Custom scroll indicator */}
        {scrollIndicator.visible && (
          <div
            className="absolute right-0 w-0.5 bg-neutral-500 rounded-full transition-opacity duration-200"
            style={{
              height: `${scrollIndicator.height}px`,
              top: `${scrollIndicator.top}px`,
            }}
          />
        )}
      </div>
    </Card>
  );
}