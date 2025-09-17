export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  population?: number;
  postcodes?: string[];
  timezone: string;
  country_id: number;
}

export interface WeatherCondition {
  description: string;
  icon: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
  is_day: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  is_day: number[];
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current?: CurrentWeather;
  hourly?: HourlyForecast;
  daily?: DailyForecast;
  current_units?: Record<string, string>;
  hourly_units?: Record<string, string>;
  daily_units?: Record<string, string>;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'ms' | 'mph' | 'kn';
export type PrecipitationUnit = 'mm' | 'inch';

export interface Units {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  precipitation: PrecipitationUnit;
}

export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_LOCATION = 'INVALID_LOCATION',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    public message: string,
    public statusCode?: number
  ) {
    super(message);
  }
}