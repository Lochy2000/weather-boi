import { weatherCodeMap } from '../constants/weather';
import { WeatherCondition } from '../../types';

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  return weatherCodeMap[weatherCode] || { description: 'Unknown', icon: 'sunny' };
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  return `${Math.round(temp)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number, unit: string): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatPrecipitation(amount: number, unit: string): string {
  return `${amount.toFixed(1)} ${unit}`;
}

export function getWeatherIconPath(icon: string): string {
  return `/assets/images/icon-${icon}.webp`;
}

export function isNightTime(isDay: number): boolean {
  return isDay === 0;
}