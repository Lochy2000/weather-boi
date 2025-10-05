# Weather App

![Weather App Preview](./preview.jpg)

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Educational-blue.svg)](LICENSE)

A modern, responsive weather application that provides real-time weather information, 7-day forecasts, and hourly temperature data with an intuitive interface. Built with React, TypeScript, and powered by the Open-Meteo API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Features

### Core Functionality
- **Smart Location Search** - Autocomplete suggestions for cities worldwide with debounced input
- **Geolocation Support** - One-click "Use My Location" with browser geolocation API
- **Real-Time Weather Data** - Current temperature, conditions, and location details
- **Comprehensive Metrics** - Feels like temperature, humidity, wind speed/direction, and precipitation
- **7-Day Forecast** - Daily high/low temperatures with weather condition icons
- **Hourly Timeline** - 24-hour temperature forecast with interactive day selection
- **Extended Weather Metrics** - UV index, visibility, air pressure, wind gusts, and cloud cover
- **Unit Conversion** - Toggle between Imperial (°F, mph, in) and Metric (°C, km/h, mm) units
- **Recent Searches** - Quick access to previously searched locations stored in localStorage
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop devices
- **Dynamic Updates** - All metrics automatically update when selecting different forecast days

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **State Management** | Zustand (app state), TanStack Query (server state) |
| **Styling** | Tailwind CSS v4, Radix UI, shadcn/ui patterns |
| **Data Fetching** | Axios, TanStack Query with caching |
| **Utilities** | date-fns, zod, clsx, tailwind-merge |
| **API** | Open-Meteo (Weather & Geocoding - no API key required) |
| **Routing** | React Router DOM v7 |
| **Dev Tools** | ESLint, TypeScript, PostCSS, Autoprefixer |

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview production build locally |

## Project Structure

```
weather-app-main/
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Layout, UnitDropdown
│   │   ├── states/         # Loading, Error, Empty states
│   │   ├── ui/             # Reusable UI components
│   │   └── weather/        # Weather-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── api/            # API client and services
│   │   ├── constants/      # Application constants
│   │   └── utils/          # Utility functions
│   ├── pages/              # Route pages
│   ├── stores/             # Zustand store definitions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## API Integration

This application uses the [Open-Meteo API](https://open-meteo.com/) - a free, open-source weather API that requires no authentication.

### Endpoints

| Endpoint | Purpose | Usage |
|----------|---------|-------|
| **Geocoding API** | Location search and autocomplete | `https://geocoding-api.open-meteo.com/v1/search` |
| **Weather Forecast API** | Current, hourly, and daily weather data | `https://api.open-meteo.com/v1/forecast` |

### Data Management

- **Caching Strategy**: React Query caches weather data for 5 minutes to reduce API calls
- **Debouncing**: Search inputs are debounced to optimize geocoding requests
- **Persistence**: User preferences and recent searches stored in localStorage

## Browser Support

| Browser | Supported Versions |
|---------|-------------------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of a Frontend Mentor challenge and is for educational purposes.

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) - Free weather API with no authentication required
- [Frontend Mentor](https://www.frontendmentor.io/) - Design challenge and resources
- [shadcn/ui](https://ui.shadcn.com/) - UI component patterns and design system
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives

---

**Built with** React, TypeScript, and Vite | **Powered by** Open-Meteo API