import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useAppStore } from '../../stores/app.store';
import { Location } from '../../types';
import { cn } from '../../lib/utils/cn';

export function SearchSection() {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { locations, isLoading, search, clearSearch } = useLocationSearch();
  const { coords, loading: geolocationLoading, error: geoError, getCurrentLocation } = useGeolocation();
  const { setCurrentLocation, addRecentLocation, recentLocations } = useAppStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.length >= 2) {
      search(inputValue);
      setShowSuggestions(true);
    } else {
      clearSearch();
      setShowSuggestions(false);
    }
  }, [inputValue, search, clearSearch]);

  const handleSelectLocation = useCallback((location: Location) => {
    setCurrentLocation(location);
    addRecentLocation(location);
    setInputValue('');
    setShowSuggestions(false);
    clearSearch();
  }, [setCurrentLocation, addRecentLocation, clearSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || locations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < locations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < locations.length) {
          handleSelectLocation(locations[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleUseMyLocation = async () => {
    getCurrentLocation();
  };

  // Effect to handle when coords are available
  useEffect(() => {
    if (coords) {
      setGeoLoading(true);

      // Create a location object directly from coordinates
      // No reverse geocoding needed - we just need the coords for weather data
      const currentLocation: Location = {
        id: Date.now(), // Unique ID based on timestamp
        name: 'Current Location',
        latitude: coords.latitude,
        longitude: coords.longitude,
        elevation: 0,
        feature_code: 'CURRENT',
        country_code: '',
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        country_id: 0,
      };

      handleSelectLocation(currentLocation);
      setGeoLoading(false);
    }
  }, [coords, handleSelectLocation]);

  return (
    <div className="mb-8 text-center">
      <h1 className="mb-8 text-4xl font-bold text-neutral-0 md:text-5xl">
        How's the sky looking today?
      </h1>
      
      <div ref={searchRef} className="relative mx-auto max-w-2xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for a place..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="h-12 bg-neutral-800 border-neutral-700 text-neutral-0 placeholder:text-neutral-300"
              prefix={
                <img
                  src="/assets/images/icon-search.svg"
                  alt="Search"
                  className="h-5 w-5"
                />
              }
            />
            
            {isLoading && showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg bg-neutral-800 px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-neutral-300">
                  <img 
                    src="/assets/images/icon-loading.svg" 
                    alt="Loading" 
                    className="h-4 w-4 animate-spin"
                  />
                  <span className="text-sm">Search in progress</span>
                </div>
              </div>
            )}
            
            {isFocused && !inputValue && recentLocations.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-neutral-800 shadow-lg">
                <div className="px-4 py-2 text-xs font-medium text-neutral-300 border-b border-neutral-700">
                  Recent searches
                </div>
                {recentLocations.map((location) => (
                  <button
                    key={location.id}
                    className={cn(
                      'w-full px-4 py-3 text-left text-neutral-0 transition-colors hover:bg-neutral-700'
                    )}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-neutral-300">
                      {[location.admin1, location.country].filter(Boolean).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && locations.length > 0 && !isLoading && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-neutral-800 shadow-lg">
                {locations.map((location, index) => (
                  <button
                    key={location.id}
                    className={cn(
                      'w-full px-4 py-3 text-left text-neutral-0 transition-colors hover:bg-neutral-700',
                      index === selectedIndex && 'bg-neutral-700'
                    )}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-neutral-300">
                      {[location.admin1, location.country].filter(Boolean).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="default"
            size="lg"
            className="h-12 px-8"
            onClick={() => {
              if (locations.length > 0) {
                handleSelectLocation(locations[0]);
              }
            }}
            disabled={inputValue.length < 2 || isLoading}
          >
            Search
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6 bg-neutral-800 border-neutral-700 text-neutral-0 hover:bg-neutral-700"
            onClick={handleUseMyLocation}
            disabled={geolocationLoading || geoLoading}
          >
            {geolocationLoading || geoLoading ? (
              <>
                <img
                  src="/assets/images/icon-loading.svg"
                  alt="Loading"
                  className="h-4 w-4 animate-spin mr-2"
                />
                Detecting...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use My Location
              </>
            )}
          </Button>
        </div>

        {geoError && (
          <div className="mt-2 text-sm text-red-400">
            {geoError}
          </div>
        )}
      </div>
    </div>
  );
}