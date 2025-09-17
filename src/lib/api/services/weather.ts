import { apiClient } from '../client';
import { API_CONFIG } from '../config';
import { WeatherData, Units } from '../../../types';
import { 
  CURRENT_WEATHER_VARIABLES, 
  HOURLY_VARIABLES, 
  DAILY_VARIABLES 
} from '../../constants/weather';

interface WeatherParams {
  latitude: number;
  longitude: number;
  units: Units;
  forecast_days?: number;
}

export const weatherService = {
  getForecast: async (params: WeatherParams): Promise<WeatherData> => {
    const response = await apiClient.get<WeatherData>(`${API_CONFIG.WEATHER_BASE_URL}/forecast`, {
      params: {
        latitude: params.latitude,
        longitude: params.longitude,
        current: CURRENT_WEATHER_VARIABLES.join(','),
        hourly: HOURLY_VARIABLES.join(','),
        daily: DAILY_VARIABLES.join(','),
        temperature_unit: params.units.temperature,
        wind_speed_unit: params.units.windSpeed,
        precipitation_unit: params.units.precipitation,
        timezone: 'auto',
        forecast_days: params.forecast_days || 7,
      }
    });

    return response.data;
  }
};