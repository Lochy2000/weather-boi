import { WeatherCondition } from '../../types';

export const weatherCodeMap: Record<number, WeatherCondition> = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'overcast' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle' },
  61: { description: 'Slight rain', icon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain' },
  71: { description: 'Slight snow', icon: 'snow' },
  73: { description: 'Moderate snow', icon: 'snow' },
  75: { description: 'Heavy snow', icon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain' },
  85: { description: 'Slight snow showers', icon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'storm' }
};

export const CURRENT_WEATHER_VARIABLES = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m'
];

export const HOURLY_VARIABLES = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'is_day'
];

export const DAILY_VARIABLES = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max'
];