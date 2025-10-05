import React from 'react';
import { Layout } from './components/layout/Layout';
import { InstallPWA } from './components/layout/InstallPWA';
import { InstallBanner } from './components/layout/InstallBanner';
import { SearchSection } from './components/weather/SearchSection';
import { WeatherDashboard } from './components/weather/WeatherDashboard';
import { SunriseSunset } from './components/weather/SunriseSunset';
import { LoadingState } from './components/states/LoadingState';
import { ErrorState } from './components/states/ErrorState';
import { EmptyState } from './components/states/EmptyState';
import { useAppStore } from './stores/app.store';
import { useWeatherData } from './hooks/useWeatherData';

function App() {
  const { currentLocation, units, selectedDay } = useAppStore();
  const {
    data: weather,
    isLoading,
    error,
    refetch
  } = useWeatherData(currentLocation, units);

  return (
    <>
      <Layout>
        <SearchSection />

        {/* Sun & Daylight info - floating dropdown */}
        {currentLocation && weather && !isLoading && !error && weather.daily && (
          <div className="mb-6">
            <SunriseSunset
              dailyForecast={weather.daily}
              selectedDay={selectedDay}
            />
          </div>
        )}

        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <ErrorState
            message={error.message}
            onRetry={() => refetch()}
          />
        )}

        {!currentLocation && !isLoading && !error && (
          <EmptyState />
        )}

        {currentLocation && weather && !isLoading && !error && (
          <WeatherDashboard
            weather={weather}
            location={currentLocation}
          />
        )}
      </Layout>

      <InstallPWA />
      <InstallBanner />
    </>
  );
}

export default App
