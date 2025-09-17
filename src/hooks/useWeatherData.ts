import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../lib/api/services/weather';
import { Location, Units, WeatherData } from '../types';
import { API_CONFIG } from '../lib/api/config';

export function useWeatherData(location: Location | null, units: Units) {
  return useQuery<WeatherData>({
    queryKey: ['weather', location?.id, units],
    queryFn: () => {
      if (!location) throw new Error('No location selected');
      return weatherService.getForecast({
        latitude: location.latitude,
        longitude: location.longitude,
        units,
      });
    },
    enabled: !!location,
    staleTime: API_CONFIG.STALE_TIME,
    gcTime: API_CONFIG.CACHE_TIME,
    retry: 2,
  });
}