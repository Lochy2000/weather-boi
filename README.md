<div align="center">

# 🌤️ Weather Now

<img width="200" height="200" alt="Weather Now Logo" src="https://github.com/user-attachments/assets/9de87993-6960-42f6-8b4c-3afca9684932" />

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

A modern weather application that brings real-time forecasts right to your fingertips.  
Built as a Progressive Web App, it offers an intuitive interface for checking weather conditions anywhere in the world, with support for installation on both mobile and desktop devices.

</div>


## Preview

<img width="1000" height="600" alt="image" src="https://github.com/user-attachments/assets/cb0f85fa-ce7d-4697-a4e1-1adaabcc2b28" />


## Table of Contents

- [What This App Does](#what-this-app-does)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Project Architecture](#project-architecture)
- [PWA Features](#pwa-features)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## What This App Does

This is my personal weather companion app. Users can search for any city worldwide, or use their current location to instantly see:

- Current temperature and weather conditions
- Detailed metrics like humidity, wind speed, UV index, and visibility
- 7-day forecast with daily highs and lows
- Hourly temperature trends throughout the day
- Sunrise and sunset times

The app remembers recent searches and preferences, making it quick to check weather for favorite locations. Plus, as a PWA, it can be installed on devices for faster access and offline support.

## Key Features

### Smart Search & Location
- **Autocomplete Search** - Start typing a city name and get instant suggestions from around the world
- **Geolocation Support** - One tap to get weather for your current location using your device's GPS
- **Recent Searches** - Quick access to your last 5 searched locations

### Comprehensive Weather Data
- **Current Conditions** - Live temperature, weather description, and location details
- **Extended Metrics** - Feels-like temperature, humidity, precipitation, wind speed and direction
- **Advanced Data** - UV index with safety levels, visibility distance, air pressure, wind gusts, and cloud coverage
- **7-Day Forecast** - Daily weather outlook with high/low temps and conditions
- **Hourly Timeline** - 24-hour temperature chart that updates based on selected day

### User Experience
- **Unit Toggle** - Switch between Celsius/Fahrenheit, km/h/mph, and mm/inches
- **Responsive Design** - Optimized layouts for phones, tablets, and desktops
- **Dark/Light Themes** - Automatic theme detection with manual override
- **PWA Installation** - Install as an app on Android, iOS, and desktop browsers
- **Offline Ready** - Service worker caching for basic offline functionality

## Tech Stack

Built with modern web technologies for performance and developer experience:

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **State Management** | Zustand (client state), TanStack Query (server state) |
| **Styling** | Tailwind CSS v4, Radix UI primitives, shadcn/ui patterns |
| **Data Fetching** | Axios, TanStack Query with intelligent caching |
| **PWA** | Service Worker, Web App Manifest |
| **Utilities** | date-fns, zod, lucide-react icons |
| **API** | Open-Meteo (free, no API key required) |
| **Routing** | React Router DOM v7 |
| **Dev Tools** | ESLint, TypeScript, PostCSS |

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd weather-app-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview production build locally |

## How It Works

Here's how the different pieces of this application work together.

### The Big Picture

When users first load the app, they see a search bar. As they type a city name, the app queries the Open-Meteo Geocoding API to suggest matching locations. After selecting one (or clicking "Use My Location"), the app fetches comprehensive weather data for that location.

The weather data gets cached for 5 minutes using React Query, so switching between locations doesn't waste API calls or require reloading. Recent searches and unit preferences are stored in localStorage and persist between visits.

### Component Architecture

The app is organized into focused, reusable components:

#### Layout Components
- **Header** - Houses the app logo and unit conversion dropdown
- **Layout** - Main wrapper that provides consistent spacing and structure
- **InstallBanner** - Subtle footer with install option (only shows when app is installable)

#### Weather Components
- **WeatherDashboard** - The main container orchestrating all weather displays
- **CurrentWeatherCard** - Shows the big temperature number, condition icon, and location
- **WeatherMetrics** - Grid displaying feels-like temp, humidity, wind, and precipitation
- **ExtendedMetrics** - Collapsible section with UV index, visibility, pressure, gusts, and clouds
- **DailyForecast** - 7 cards showing daily forecasts with highs, lows, and icons
- **HourlyForecast** - Interactive chart showing temperature progression over 24 hours
- **SunriseSunset** - Displays sunrise and sunset times with visual indicators
- **SearchSection** - The search input with autocomplete and geolocation button

#### UI Primitives
Reusable building blocks like `Button`, `Card`, `Input`, `Skeleton`, and `Toast` that maintain consistent styling across the app.

### State Management Strategy

The app uses two complementary state management approaches:

#### Client State (Zustand)
Handles everything that lives in the browser:
- **User Preferences** - Selected units for temperature, wind, and precipitation
- **Location Data** - Currently selected location and recent search history (max 5)
- **UI State** - Which day is selected, loading transitions

This state persists to localStorage, so preferences survive page refreshes.

#### Server State (React Query)
Manages data fetched from APIs:
- **Weather Data** - Current conditions, hourly, and daily forecasts
- **Location Searches** - Geocoding results

React Query provides automatic caching, background refetching, and optimistic updates. It knows when data is stale and needs refreshing.

### API Integration

The app talks to two Open-Meteo endpoints:

**Geocoding API** (`https://geocoding-api.open-meteo.com/v1/search`)
- Takes a city name query
- Returns matching locations with coordinates, country, and timezone info

**Weather Forecast API** (`https://api.open-meteo.com/v1/forecast`)
- Takes latitude/longitude coordinates
- Returns current weather, hourly forecasts (48 hours), and daily forecasts (7 days)
- Automatically handles unit conversions based on your preferences

All API calls go through centralized service functions in `lib/api/services/`, which handle error transformation and provide consistent interfaces.

### Data Flow

Here's what happens when searching for a city:

1. User types into the search input (debounced by 300ms to avoid hammering the API)
2. Geocoding service fetches matching locations
3. User selects a location from the dropdown
4. Location gets saved to Zustand store and added to recent searches
5. React Query detects the location change and triggers a weather data fetch
6. Weather service fetches forecast data, which gets cached by React Query
7. All weather components react to the new data and update their displays
8. When selecting a different day in the forecast, all metrics update to show that day's data

### Performance Optimizations

**Caching**
- Weather data cached for 5 minutes (reduces redundant API calls)
- Recent locations persist in localStorage
- Service worker caches app shell for offline access

**Debouncing**
- Search input debounced by 300ms to prevent excessive API requests while typing

**Code Optimization**
- Tree-shaking with ES modules eliminates unused code
- Tailwind CSS purges unused styles in production
- Vite's fast refresh keeps development smooth

**Rendering**
- Skeleton screens show immediately during loading (perceived performance)
- Minimal re-renders through precise state updates
- SVG icons for crisp display at any size

## Project Architecture

```
weather-app-main/
├── public/
│   ├── manifest.json        # PWA manifest
│   └── sw.js               # Service worker for offline support
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Layout, Logo, Unit dropdown, PWA install
│   │   ├── states/         # Loading, Error, Empty state components
│   │   ├── ui/             # Button, Card, Input, Skeleton, Toast
│   │   └── weather/        # All weather-specific components
│   ├── hooks/              # Custom hooks (useDebounce, useGeolocation, etc.)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── services/   # geocoding.ts, weather.ts
│   │   │   ├── client.ts   # Axios instance configuration
│   │   │   └── config.ts   # API endpoints and cache settings
│   │   ├── constants/      # App-wide constants
│   │   └── utils/          # Helper functions
│   ├── pages/              # Route page components
│   ├── stores/             # Zustand stores (app, favorites, theme)
│   ├── types/              # TypeScript interfaces and types
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point, React Query setup, SW registration
│   └── index.css           # Tailwind directives and global styles
├── index.html              # HTML entry point with PWA meta tags
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## PWA Features

This app is a full Progressive Web App, which means:

### Installation
- **Desktop (Chrome/Edge)** - Click the install icon in the address bar, or use the in-app install prompt
- **Android** - Tap "Add to Home Screen" from the browser menu, or use the in-app banner/toast
- **iOS Safari** - Tap Share → "Add to Home Screen" (manual installation)

### Install Prompts
The app includes a subtle footer with an install option that only appears when the app is installable and not already installed.

### Offline Support
The service worker caches the app shell and key resources, so basic functionality works even without internet. Weather data requires a connection, but the UI remains accessible.

### Manifest Configuration
- **Name**: Weather Now
- **Display**: Standalone (no browser UI)
- **Theme Color**: Blue (#3b82f6)
- **Icons**: Multiple sizes for different devices

## Browser Support

| Browser | Versions | PWA Install |
|---------|----------|-------------|
| Chrome | Last 2 versions | Yes (desktop & Android) |
| Edge | Last 2 versions | Yes (desktop & Android) |
| Firefox | Last 2 versions | No install prompt |
| Safari | Last 2 versions | Manual (iOS) |

PWA installation prompts work best on Chrome and Edge (Android and desktop). iOS users can manually add to home screen via Safari's share menu.

## Contributing

Contributions are welcome! If you'd like to improve the app:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cool-feature`)
3. Make your changes and commit (`git commit -m 'Add cool feature'`)
4. Push to your branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

## License

This project is part of a Frontend Mentor challenge and is for educational purposes.

## Acknowledgments

- **[Open-Meteo](https://open-meteo.com/)** - Free weather API with no authentication required
- **[Frontend Mentor](https://www.frontendmentor.io/)** - Design challenge and assets
- **[shadcn/ui](https://ui.shadcn.com/)** - Component patterns and design inspiration
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide](https://lucide.dev/)** - Beautiful icon library

---

**Built with** React, TypeScript, and Vite | **Powered by** Open-Meteo API | **Installable** as a PWA
