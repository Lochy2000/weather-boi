import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAppStore } from '../../stores/app.store';
import { Units } from '../../types';

export function UnitDropdown() {
  const { units, setUnits } = useAppStore();

  const isMetric = units.temperature === 'celsius';

  const handleToggleAll = () => {
    const newUnits: Units = {
      temperature: isMetric ? 'fahrenheit' : 'celsius',
      windSpeed: isMetric ? 'mph' : 'kmh',
      precipitation: isMetric ? 'inch' : 'mm',
    };
    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: 'celsius' | 'fahrenheit') => {
    setUnits({
      ...units,
      temperature: value,
    });
  };

  const handleWindSpeedChange = (value: 'kmh' | 'mph') => {
    setUnits({
      ...units,
      windSpeed: value,
    });
  };

  const handlePrecipitationChange = (value: 'mm' | 'inch') => {
    setUnits({
      ...units,
      precipitation: value,
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-0 transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Change units"
        >
          <img
            src="/assets/images/icon-units.svg"
            alt="Units"
            className="h-4 w-4"
          />
          <span>Units</span>
          <img
            src="/assets/images/icon-dropdown.svg"
            alt="Toggle"
            className="h-3 w-3"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[280px] rounded-lg bg-neutral-700 p-3 shadow-lg"
          sideOffset={5}
          align="end"
        >
          <button
            onClick={handleToggleAll}
            className="mb-3 w-full rounded-md bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-0 transition-colors hover:bg-neutral-600"
          >
            Switch to {isMetric ? 'Imperial' : 'Metric'}
          </button>

          <div className="space-y-3">
            <div>
              <div className="mb-2 text-xs font-medium text-neutral-300">Temperature</div>
              <div className="space-y-1">
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handleTemperatureChange('celsius')}
                >
                  <span>Celsius (°C)</span>
                  {units.temperature === 'celsius' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handleTemperatureChange('fahrenheit')}
                >
                  <span>Fahrenheit (°F)</span>
                  {units.temperature === 'fahrenheit' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-neutral-300">Wind Speed</div>
              <div className="space-y-1">
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handleWindSpeedChange('kmh')}
                >
                  <span>km/h</span>
                  {units.windSpeed === 'kmh' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handleWindSpeedChange('mph')}
                >
                  <span>mph</span>
                  {units.windSpeed === 'mph' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-neutral-300">Precipitation</div>
              <div className="space-y-1">
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handlePrecipitationChange('mm')}
                >
                  <span>Millimeters (mm)</span>
                  {units.precipitation === 'mm' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-0 transition-colors hover:bg-neutral-600"
                  onClick={() => handlePrecipitationChange('inch')}
                >
                  <span>Inches (in)</span>
                  {units.precipitation === 'inch' && (
                    <img
                      src="/assets/images/icon-checkmark.svg"
                      alt="Selected"
                      className="h-4 w-4"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <DropdownMenu.Arrow className="fill-neutral-700" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}